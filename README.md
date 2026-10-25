# EFRISBridge — Standalone React Prototype

A local interactive demo of a proposed EFRIS middleware workflow.

## Important
- No live URA connection or tax-data submission is implemented.
- The progress sequence is simulated in the browser.
- FDN and anti-fake identifiers are randomly generated demo values, not official URA-issued values.
- The QR code encodes an `example.com` sample URL, not an official verification page.
- Commodity mapping codes are demonstration examples and must be checked against URA's current official catalogue before real use.
- The displayed total is quantity × unit price. VAT/tax treatment is not calculated.

## Run on Windows with VS Code

1. Extract this ZIP into a folder, for example `Documents\efris-react-demo`.
2. Open that folder in VS Code.
3. Choose **Terminal → New Terminal**.
4. Run `dir`. You should see `package.json`, `index.html`, and `src`.
5. Check that Node.js and npm are installed:
   ```powershell
   node -v
   npm -v
   ```
   If either command is not recognised, install Node.js LTS from the official Node.js website, then restart VS Code.
6. Install dependencies once:
   ```powershell
   npm install
   ```
   This needs internet the first time.
7. Start the app:
   ```powershell
   npm run dev
   ```
8. Open the local URL Vite prints, usually `http://localhost:5173/`, in Chrome or Edge.
9. Keep the terminal open during the demo. Press `Ctrl+C` in the terminal to stop it.

## Try the demo
- Edit customer, TIN, date, item, quantity and price.
- Try `50 Bags Tororo Cement`, `Maize flour`, `Cooking oil`, `Sugar`, or an unknown description.
- Click **Save & Submit Invoice** and watch the four processing steps.
- Review the sample FDN, sample verification code and QR.
- Click **Print preview** to open the browser print dialog.
- Use **New invoice** or **Reset demo** to replay.

## Optional build check
Run `npm run build`. Vite will create a `dist` folder if the project builds successfully.

## Main files
- `src/App.jsx`: invoice form, local mapping, simulated processing, receipt and QR code
- `src/styles.css`: responsive layout and print styling
- `src/main.jsx`: React entry point and Bootstrap import
- `package.json`: project dependencies and scripts

## Suggested client explanation
“This is an interactive prototype. It demonstrates the proposed workflow, while gateway communication and fiscal identifiers are simulated. A live pilot would require approved URA access, validated commodity codes, security controls, error handling and integration testing.”


## Accounting-practice multi-client mode

The prototype now opens on a practice dashboard with six fictional client accounts. It demonstrates:
- Portfolio-level green / yellow / red client health states.
- Sample pending-queue counts and last-activity labels.
- Opening a client to inspect the existing invoice-entry, commodity-mapping and simulated fiscal-output workflow.
- Switching clients from the client selector without returning to a login screen.
- Returning to the practice dashboard from a client workspace.

All client records and health states are local illustrative data. No client account, accounting platform, network queue, or URA EFRIS endpoint is connected. The dashboard is a product concept demo, not evidence of a production multi-tenant system.
