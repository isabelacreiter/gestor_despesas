# Quick Integration Guide for Tab Button Diagnostics

## Problem Summary
Tab buttons ("Entradas", "Saída Manual", "Nota Fiscal") aren't being found by `cy.contains("button", ...)` even with 10-second timeout, despite:
- Page loading successfully (title "Fluxo Financeiro" visible)
- Buttons existing in the component code (lines 267-283)
- DOM inspection showing they should be there

## Solution: Add Diagnostic Output

### Option 1: Use Diagnostic Helper in Existing Tests (Quick)

Edit `cypress/support/step_definitions/manual-expense-form.ts`:

```typescript
import { When } from "@badeball/cypress-cucumber-preprocessor";
import { debugTabButtons, logAllButtons } from "../tab-button-diagnostic-helper";

// Add logging to your existing step
When("clico na aba {string}", (tabLabel: string) => {
  // Add these diagnostic calls BEFORE your current cy.contains
  debugTabButtons();  // Detailed diagnostic
  logAllButtons();    // Quick inventory
  
  // Your existing code:
  cy.contains("button", tabLabel, { timeout: 10000 })
    .should("be.visible")
    .click();
});
```

### Option 2: Run Full Diagnostic Test (Comprehensive)

```bash
# Runs all diagnostic tests with full logging and screenshots
npx cypress run --spec "cypress/e2e/diagnostic-tab-buttons.cy.ts" --headed
```

### Option 3: Replace with Robust Click Function

Edit your step definition to use the more robust approach:

```typescript
import { When } from "@badeball/cypress-cucumber-preprocessor";
import { clickButtonByText } from "../tab-button-diagnostic-helper";

When("clico na aba {string}", (tabLabel: string) => {
  clickButtonByText(tabLabel, { timeout: 10000, force: false });
});
```

## What the Diagnostics Will Tell You

### Most Likely Findings & Fixes:

**Finding #1: Button text includes both spans ("01 Entradas" instead of just "Entradas")**
- **Why**: Component renders: `<span>01</span><span>Entradas</span>` so .text() returns "01 Entradas"
- **Fix**: Modify component to add test ID:
  ```tsx
  <button data-testid={`tab-${tab.id}`} ...>
  ```
  Then use: `cy.get('[data-testid="tab-income"]').click()`

**Finding #2: Display/Visibility CSS properties are hidden**
- **Why**: CSS classes or media queries hiding buttons
- **Fix**: Check `src/components/expense-dashboard-app.tsx` around line 215 for hidden classes

**Finding #3: Bounding rect shows width=0 or height=0**
- **Why**: Buttons are in DOM but rendered with zero size
- **Fix**: Check flex layout or parent container CSS constraints

**Finding #4: Window.__NEXT_DATA__ not found**
- **Why**: Page hydration incomplete when test runs
- **Fix**: Add explicit wait in beforeEach:
  ```typescript
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.contains("Fluxo Financeiro").should("be.visible");
    cy.get("button").should("have.length.greaterThan", 0);
    cy.wait(1000); // Allow hydration
  });
  ```

## Step-by-Step Diagnostic Process

1. **Run diagnostic test**:
   ```bash
   npx cypress run --spec "cypress/e2e/diagnostic-tab-buttons.cy.ts" --headed
   ```

2. **Check console output for**:
   - Button count
   - Tab button count (should be 3)
   - Visibility status (should be ✓)
   - Text content

3. **Check screenshots** in `cypress/screenshots/`:
   - `01-initial-page-load.png` - Full page view
   - `02-tab-buttons-area.png` - Tab area closeup
   - `03-tab-buttons-detailed.png` - Detailed structure

4. **Share findings** with:
   - Console log output
   - Screenshots
   - Any error messages

## Temporary Workaround (While Diagnosing)

If you need tests to run while diagnosing, modify step to use manual search:

```typescript
When("clico na aba {string}", (tabLabel: string) => {
  cy.get("button")
    .then(($buttons) => {
      const button = $buttons.toArray().find((btn) =>
        Cypress.$(btn).text().includes(tabLabel)
      );
      return cy.wrap(button);
    })
    .should("be.visible")
    .click();
});
```

This bypasses `cy.contains()` and searches buttons manually, which works even if text structure is complex.

## Files to Review

After running diagnostics, examine these files:

1. **src/components/expense-dashboard-app.tsx** (lines 210-240)
   - Tab button rendering logic
   - CSS classes that might affect visibility

2. **cypress/e2e/diagnostic-tab-buttons.cy.ts**
   - View test output and logs

3. **CYPRESS_DIAGNOSTIC_GUIDE.md**
   - Full reference for all diagnostic tests

## Next Steps

1. Run diagnostic: `npx cypress run --spec "cypress/e2e/diagnostic-tab-buttons.cy.ts" --headed`
2. Collect console output + screenshots
3. Identify which finding matches your situation
4. Apply corresponding fix
5. Verify with: `npx cypress run --spec "cypress/e2e/create-expense.feature"`
