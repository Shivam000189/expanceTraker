import { useRef, useState } from 'react'
import { FileSpreadsheet, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import API from '../../api'

function parseCsv(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length < 2) {
    return []
  }

  const headers = lines[0].split(',').map((header) => header.trim())

  return lines.slice(1).map((line, index) => {
    const values = line.split(',').map((value) => value.trim())
    const row = headers.reduce((accumulator, header, headerIndex) => {
      accumulator[header] = values[headerIndex] || ''
      return accumulator
    }, {})

    return {
      vendorName: row.vendorName || '',
      accountNumber: row.accountNumber || '',
      ifscCode: row.ifscCode || '',
      amount: row.amount || '',
      rowNumber: index + 2,
    }
  })
}

export function CSVUploader({ onValidated, setBusy }) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState('')
  const inputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file) {
      return
    }

    setFileName(file.name)
    setBusy(true)

    try {
      const text = await readFile(file)
      const parsedRows = parseCsv(text)

      if (!parsedRows.length) {
        toast.error('CSV is empty or missing data rows')
        onValidated({ valid: [], invalid: [], sourceRows: [] })
        return
      }

      const response = await API.post('/payouts/validate', parsedRows)
      onValidated({
        valid: response.data.valid || [],
        invalid: response.data.invalid || [],
        sourceRows: parsedRows,
      })
      toast.success('CSV parsed successfully')
    } catch (error) {
      console.error('Failed to process CSV:', error)
      toast.error(error.response?.data?.msg || 'Failed to parse payout CSV')
    } finally {
      setBusy(false)
    }
  }

  const onDrop = async (event) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files?.[0]
    await handleFile(file)
  }

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/90 p-5 shadow-sm backdrop-blur-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold tracking-tight text-white">Upload Payout CSV</h2>
        <p className="text-[11px] text-zinc-400">
          Drag in a payout batch sheet or choose a CSV file with vendor accounts.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 items-stretch">
        <div
          onDragOver={(event) => {
            event.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all flex flex-col items-center justify-center ${
            isDragging
              ? 'border-white bg-white/5'
              : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
          }`}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-zinc-800 text-zinc-200 shadow-sm">
            <Upload size={20} />
          </div>
          <h3 className="mt-3 text-base font-bold text-white">Drop your CSV here</h3>
          <p className="mt-0.5 text-xs text-zinc-400">or click to browse from device</p>
          {fileName ? (
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs font-semibold text-zinc-300 shadow-sm">
              <FileSpreadsheet size={13} />
              {fileName}
            </div>
          ) : null}
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0]
              await handleFile(file)
              event.target.value = ''
            }}
          />
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-4 text-white flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Sample CSV Format</p>
            <pre className="mt-2 overflow-x-auto font-mono text-[11px] leading-5 text-zinc-300 bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/60">
{`vendorName,accountNumber,ifscCode,amount
Acme Supplies,1234567890,HDFC0123456,12500
North Traders,9876543210,ICIC0ABC123,8900`}
            </pre>
          </div>
          <div className="mt-3 pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-500">
            Ensure column headers exactly match the sample above for automatic validation.
          </div>
        </div>
      </div>
    </div>
  )
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Unable to read file'))
    reader.readAsText(file)
  })
}
