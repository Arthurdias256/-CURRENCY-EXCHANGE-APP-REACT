import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import HistoryTable from './HistoryTable'

const points = [
  { date: '2024-01-03', rate: 3 },
  { date: '2024-01-01', rate: 2 },
  { date: '2024-01-02', rate: 2.5 },
]

describe('HistoryTable', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValue('blob:history'),
      revokeObjectURL: vi.fn(),
    })
    vi.spyOn(window, 'setTimeout').mockImplementation((callback) => {
      callback()
      return 0
    })
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('filters quotes by localized date and reports the visible count', () => {
    render(
      <HistoryTable
        points={points}
        base="USD"
        quote="BRL"
        amount="2"
        periodId="30d"
      />,
    )

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar data' }), {
      target: { value: '02/01/2024' },
    })

    expect(screen.getByText('USD → BRL · 1 de 3 registros')).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(2)
    expect(screen.getByRole('cell', { name: '02/01/2024' })).toBeInTheDocument()
  })

  it('sorts rates in ascending and descending order without mutating source points', () => {
    const originalDates = points.map((point) => point.date)
    render(
      <HistoryTable
        points={points}
        base="USD"
        quote="BRL"
        amount="2"
        periodId="30d"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Ordenar por taxa crescente' }))

    const table = screen.getByRole('table')
    const ascendingRates = within(table)
      .getAllByRole('row')
      .slice(1)
      .map((row) => within(row).getAllByRole('cell')[2].textContent)
    expect(ascendingRates).toEqual(['2,00', '2,50', '3,00'])

    fireEvent.click(screen.getByRole('button', { name: 'Ordenar por taxa decrescente' }))
    const descendingRates = within(table)
      .getAllByRole('row')
      .slice(1)
      .map((row) => within(row).getAllByRole('cell')[2].textContent)
    expect(descendingRates).toEqual(['3,00', '2,50', '2,00'])
    expect(points.map((point) => point.date)).toEqual(originalDates)
  })

  it('exports the filtered rows with the converted value, UTF-8 BOM, and spreadsheet delimiters', async () => {
    let exportedBlob
    let downloadName
    URL.createObjectURL.mockImplementation((blob) => {
      exportedBlob = blob
      return 'blob:history'
    })
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function click() {
      downloadName = this.download
    })

    render(
      <HistoryTable
        points={points}
        base="USD"
        quote="BRL"
        amount="2"
        periodId="30d"
      />,
    )

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar data' }), {
      target: { value: '02/01/2024' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Exportar CSV' }))

    const csvBytes = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(new Uint8Array(reader.result))
      reader.onerror = () => reject(reader.error)
      reader.readAsArrayBuffer(exportedBlob)
    })
    const csv = new TextDecoder('utf-8', { ignoreBOM: true }).decode(csvBytes)
    expect(downloadName).toBe('historico-cambio-usd-brl-30d.csv')
    expect(exportedBlob.type).toBe('text/csv;charset=utf-8')
    expect([...csvBytes.slice(0, 3)]).toEqual([0xef, 0xbb, 0xbf])
    expect(csv.charCodeAt(0)).toBe(0xfeff)
    expect(csv).toContain('"Data";"Moeda de origem";"Moeda de destino";"Valor convertido";"Taxa de câmbio"')
    expect(csv).toContain('"2024-01-02";"USD";"BRL";"5";"2,5"')
    expect(csv).not.toContain('2024-01-01')
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:history')
  })

  it('disables export when the search has no matching quotes', () => {
    render(
      <HistoryTable
        points={points}
        base="USD"
        quote="BRL"
        amount="2"
        periodId="30d"
      />,
    )

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar data' }), {
      target: { value: 'sem resultado' },
    })

    expect(screen.getByRole('status')).toHaveTextContent(
      'Nenhuma cotação corresponde à busca.',
    )
    expect(screen.getByRole('button', { name: 'Exportar CSV' })).toBeDisabled()
  })
})
