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
    <div className="rounded-[2rem] border border-zinc-100 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-display text-zinc-900">Upload payout CSV</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Drag in a payout sheet or choose a CSV file with vendor account details.
        </p>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-[2rem] border-2 border-dashed p-10 text-center transition-all ${
          isDragging ? 'border-primary bg-emerald-50' : 'border-zinc-200 bg-zinc-50'
        }`}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
          <Upload size={28} />
        </div>
        <h3 className="mt-5 text-xl font-bold text-zinc-900">Drop your CSV here</h3>
        <p className="mt-2 text-sm text-zinc-500">or click to browse from your device</p>
        {fileName ? (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm">
            <FileSpreadsheet size={16} />
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

      <div className="mt-8 rounded-[1.5rem] bg-zinc-900 p-6 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Sample CSV format</p>
        <pre className="mt-4 overflow-x-auto text-sm leading-7 text-zinc-200">
{`vendorName,accountNumber,ifscCode,amount
Acme Supplies,1234567890,HDFC0123456,12500
North Traders,9876543210,ICIC0ABC123,8900`}
        </pre>
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
