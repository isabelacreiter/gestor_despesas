# Cypress Tab Buttons Diagnostic Guide

## Overview
Created a comprehensive diagnostic test file that will help identify why `cy.contains("button", "Entradas")` fails to find the tab buttons.

## File Location
`cypress/e2e/diagnostic-tab-buttons.cy.ts`

## Running the Diagnostic

### Option 1: Run Specific Diagnostic Test
```bash
npx cypress run --spec "cypress/e2e/diagnostic-tab-buttons.cy.ts" --headed
```

### Option 2: Run in Cypress UI (Recommended for Visual Inspection)
```bash
npx cypress open
# Then select "E2E Testing" > "Chrome" > select the diagnostic test
```

### Option 3: Run with Console Output Capture
```bash
npx cypress run --spec "cypress/e2e/diagnostic-tab-buttons.cy.ts" --headed --no-exit 2>&1 | tee cypress-diagnostic.log
```

## What Each Test Does

1. **Button Count & Content Logging**
   - Counts total buttons on page
   - Logs each button's text, visibility, and classes
   - **Diagnoses**: Are buttons in DOM? What's their actual text content?

2. **Tab Button Search**
   - Tries to find each tab label ("Entradas", "Saída Manual", "Nota Fiscal")
   - Checks if any button text contains these labels
   - **Diagnoses**: Do the buttons exist with expected text?

3. **Visibility & CSS Properties Check**
   - Inspects computed CSS (display, visibility, opacity, pointer-events)
   - Checks bounding rect (x, y, width, height)
   - **Diagnoses**: Are buttons hidden by CSS? Are they positioned off-screen?

4. **Tab Container Structure**
   - Finds the div with `flex rounded-2xl border` classes
   - Logs each button's complete HTML structure
   - Takes detailed screenshot
   - **Diagnoses**: What's the exact DOM hierarchy?

5. **Hydration State Check**
   - Verifies Next.js has fully hydrated
   - Checks for hydration-related data attributes
   - **Diagnoses**: Is this a React hydration issue?

6. **Click Behavior Test**
   - Attempts to click each button
   - Logs success/failure for each
   - **Diagnoses**: Can buttons be interacted with even if not found by contains?

## Expected Output Format

Console output will show:
```
✓ Button 0: "01 Entradas"
✓ Button 1: "02 Saída Manual"
✓ Button 2: "03 Nota Fiscal"
```

Or if failing:
```
✗ FAILED - Button not found with cy.contains
```

## Checking Screenshots

The diagnostic will create several screenshots in `cypress/screenshots/`:
- `01-initial-page-load` - Full page after load
- `02-tab-buttons-area` - Tab buttons area
- `03-tab-buttons-detailed` - Detailed button view
- `04-after-click-*` - State after clicking each button

## Key Diagnostic Indicators

**If you see in the logs:**

| Finding | Likely Issue |
|---------|-------------|
| `Button found with label "Entradas"` but `cy.contains` still fails | Text structure issue - the span hierarchy makes simple contains() fail |
| `Display: none` or `Visibility: hidden` | CSS hiding the buttons |
| `x: 0, y: 0, width: 0, height: 0` | Buttons are hidden off-screen |
| `Opacity: 0` | CSS opacity is set to 0 |
| Window.__NEXT_DATA__: NOT FOUND | Hydration hasn't completed |
| Button count is 0 | Buttons aren't rendering at all |

## Next Steps Based on Findings

### If buttons are found but `cy.contains()` fails:
**Problem**: Buttons have nested `<span>` elements, so cy.contains can't match the text directly.

**Solution**: Add test IDs or use more specific selectors:
```javascript
// Instead of:
cy.contains("button", "Entradas")

// Use:
cy.get("button").filter((index, el) => {
  return Cypress.$(el).text().includes("Entradas");
}).click()

// Or add data-testid to component:
<button data-testid="tab-entradas">...</button>
cy.get('[data-testid="tab-entradas"]')
```

### If buttons aren't visible:
**Problem**: CSS issue hiding buttons

**Solution**: Check `src/components/expense-dashboard-app.tsx` lines 215-240 for classes that might be hiding buttons. Verify `backdrop-blur-sm`, background opacity, or conditional rendering.

### If hydration issue:
**Problem**: Components don't render until hydration completes

**Solution**: Add explicit waits in test setup:
```javascript
beforeEach(() => {
  cy.visit("http://localhost:3000");
  // Wait for specific content that only appears after hydration
  cy.contains("Fluxo Financeiro").should("be.visible");
  // Additional wait for reactive state
  cy.get("button").should("have.length.greaterThan", 0);
});
```

## Collecting Before/After for Report

After running diagnostic:
1. Copy screenshots from `cypress/screenshots/diagnostic-tab-buttons.cy.ts/`
2. Save the full console output
3. Include in your test report to show what was investigated

## Questions to Answer with This Diagnostic

1. How many buttons total are on the page?
2. What is the exact text content of each button?
3. Are the buttons visible according to CSS?
4. Are the buttons positioned correctly (not off-screen)?
5. Is the page fully hydrated?
6. Can buttons be clicked even if not found by `cy.contains()`?

Once you run this and share the output, we can pinpoint the exact issue and create a targeted fix.
