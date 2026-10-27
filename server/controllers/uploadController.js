const { parse } = require("csv-parse/sync");
const Transaction = require("../models/Transaction");

const MAX_ROWS = 1000;

exports.uploadTransactions = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const rows = parse(req.file.buffer.toString("utf-8"), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    if (rows.length === 0) return res.status(400).json({ error: "The CSV file has no data rows" });
    if (rows.length > MAX_ROWS) {
      return res.status(400).json({ error: `Maximum ${MAX_ROWS} rows allowed per upload` });
    }

    const validRows = [];
    const errors = [];

    rows.forEach((row, index) => {
      const line = index + 2; // header is line 1
      const type = (row.type || "").toLowerCase();
      const amount = Number(row.amount);
      const date = new Date(row.date);

      if (!["income", "expense"].includes(type))
        return errors.push({ row: line, reason: "type must be income or expense" });
      if (!row.category) return errors.push({ row: line, reason: "category is required" });
      if (row.amount === "" || Number.isNaN(amount) || amount < 0)
        return errors.push({ row: line, reason: "amount must be a number, 0 or more" });
      if (Number.isNaN(date.getTime()))
        return errors.push({ row: line, reason: "date is invalid (use YYYY-MM-DD)" });
      if (row.note && row.note.length > 200)
        return errors.push({ row: line, reason: "note exceeds 200 characters" });

      validRows.push({
        user: req.userId,
        type,
        category: row.category,
        amount,
        date,
        note: row.note || undefined,
      });
    });

    if (validRows.length > 0) await Transaction.insertMany(validRows);

    res.status(201).json({ imported: validRows.length, skipped: errors.length, errors });
  } catch (error) {
    res.status(400).json({ error: `Could not process file: ${error.message}` });
  }
};
