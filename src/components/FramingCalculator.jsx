import { useMemo, useState } from 'react';

// Stub pricing — replace these with your real reference values
// (the same numbers that lived in your Google Sheet's reference cell).
// Keeping them named like this avoids the cell-reference mismatch
// issues you ran into in Sheets — there's no "which cell was that
// pointing at again?" problem when it's just a labelled object.
const SHEET_OPTIONS = {
  full: { label: 'Full Sheet', multiplier: 1 },
  half: { label: 'Half Sheet', multiplier: 0.55 },
  '10mm': { label: '10mm Sheet', multiplier: 1.2 },
};

const BASE_RATE = 45; // $ per unit — replace with your real base rate

export default function FramingCalculator() {
  const [sheetType, setSheetType] = useState('full');
  const [quantity, setQuantity] = useState(1);

  const total = useMemo(() => {
    const multiplier = SHEET_OPTIONS[sheetType].multiplier;
    return (BASE_RATE * multiplier * quantity).toFixed(2);
  }, [sheetType, quantity]);

  return (
    <div className="max-w-md border border-stone-200 rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold">Framing Calculator</h2>

      <div className="space-y-1">
        <label htmlFor="sheetType" className="block text-sm text-stone-600">
          Sheet type
        </label>
        <select
          id="sheetType"
          value={sheetType}
          onChange={(e) => setSheetType(e.target.value)}
          className="w-full border border-stone-300 rounded px-3 py-2"
        >
          {Object.entries(SHEET_OPTIONS).map(([key, opt]) => (
            <option key={key} value={key}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label htmlFor="quantity" className="block text-sm text-stone-600">
          Quantity
        </label>
        <input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          className="w-full border border-stone-300 rounded px-3 py-2"
        />
      </div>

      <div className="pt-2 border-t border-stone-200">
        <p className="text-sm text-stone-500">Estimated total</p>
        <p className="text-2xl font-semibold">${total}</p>
      </div>

      {/*
        Future Xero step: this component should call your own server
        endpoint (e.g. POST /api/pricing) instead of holding pricing
        logic client-side, once prices are sourced from Xero. The
        endpoint holds the Xero token server-side and returns just
        the number — this component never talks to Xero directly.
      */}
    </div>
  );
}
