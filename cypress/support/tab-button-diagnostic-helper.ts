/**
 * Quick Diagnostic Helper for Tab Button Issues
 * 
 * Usage in any Cypress test or step definition:
 * 
 *   import { debugTabButtons, logAllButtons } from "./tab-button-diagnostic-helper"
 *   
 *   When("clico na aba {string}", (tabLabel: string) => {
 *     debugTabButtons()  // Logs detailed info
 *     logAllButtons()    // Quick button inventory
 *     cy.contains("button", tabLabel).click()
 *   })
 */

export function debugTabButtons() {
  cy.log("\n╔════════════════════════════════════════════════════════╗");
  cy.log("║         TAB BUTTONS DIAGNOSTIC OUTPUT                 ║");
  cy.log("╚════════════════════════════════════════════════════════╝\n");

  cy.get("body").then(() => {
    cy.get("button").then(($buttons) => {
      cy.log(`📊 Total buttons found: ${$buttons.length}`);

      // Find tab buttons specifically
      const tabButtons = $buttons.toArray().filter((btn) => {
        const text = Cypress.$(btn).text().trim();
        return (
          text.includes("Entradas") ||
          text.includes("Saída Manual") ||
          text.includes("Nota Fiscal")
        );
      });

      cy.log(`🎯 Tab buttons found: ${tabButtons.length}\n`);

      if (tabButtons.length > 0) {
        tabButtons.forEach((btn, idx) => {
          const $btn = Cypress.$(btn);
          const text = $btn.text().trim();
          const isVisible = $btn.is(":visible");
          const classes = $btn.attr("class");

          cy.log(`   Button ${idx + 1}: "${text}"`);
          cy.log(`   ├─ Visible: ${isVisible ? "✓" : "✗"}`);
          cy.log(`   ├─ Display: ${window.getComputedStyle(btn).display}`);
          cy.log(`   ├─ Opacity: ${window.getComputedStyle(btn).opacity}`);
          cy.log(`   └─ Parent tag: ${btn.parentElement?.tagName}`);
        });
      } else {
        cy.log("   ❌ NO TAB BUTTONS FOUND!");
        cy.log("\n   All button texts on page:");
        $buttons.toArray().forEach((btn, idx) => {
          if (idx < 20) {
            // Limit output
            const text = Cypress.$(btn).text().trim().substring(0, 50);
            cy.log(`     ${idx + 1}. "${text}"`);
          }
        });
      }
    });
  });
}

export function logAllButtons() {
  cy.get("button").then(($buttons) => {
    cy.log(`\n📋 QUICK BUTTON INVENTORY (${$buttons.length} total):`);
    $buttons.each((idx, btn) => {
      if (idx < 15) {
        const text = Cypress.$(btn).text().trim().substring(0, 40);
        const visible = Cypress.$(btn).is(":visible") ? "✓" : "✗";
        cy.log(`   [${visible}] ${idx + 1}. "${text}"`);
      }
    });
    if ($buttons.length > 15) {
      cy.log(`   ... and ${$buttons.length - 15} more`);
    }
  });
}

export function inspectButtonAtIndex(index: number) {
  cy.get("button").eq(index).then(($btn) => {
    cy.log(`\n🔍 BUTTON INSPECTION [Index: ${index}]`);
    cy.log(`   Text: "${$btn.text().trim()}"`);
    cy.log(`   HTML: ${$btn.html()?.substring(0, 150)}`);
    cy.log(`   Classes: ${$btn.attr("class")}`);
    cy.log(`   Type: ${$btn.attr("type")}`);
    cy.log(`   Visible: ${$btn.is(":visible")}`);

    cy.window().then((win) => {
      const rect = $btn[0].getBoundingClientRect();
      const computed = win.getComputedStyle($btn[0]);
      cy.log(`   Position: (${Math.round(rect.x)}, ${Math.round(rect.y)})`);
      cy.log(`   Size: ${Math.round(rect.width)}×${Math.round(rect.height)}`);
      cy.log(`   Display: ${computed.display}`);
      cy.log(`   Visibility: ${computed.visibility}`);
      cy.log(`   Opacity: ${computed.opacity}`);
    });
  });
}

export function findButtonContaining(text: string) {
  cy.get("button").then(($buttons) => {
    const matching = $buttons
      .toArray()
      .filter((btn) => Cypress.$(btn).text().includes(text));

    if (matching.length > 0) {
      cy.log(`✓ Found ${matching.length} button(s) containing "${text}"`);
      matching.forEach((btn, idx) => {
        cy.log(`  ${idx + 1}. Full text: "${Cypress.$(btn).text().trim()}"`);
      });
      return matching[0]; // Return first match
    } else {
      cy.log(`✗ NO button found containing "${text}"`);
      cy.log("Available button texts:");
      $buttons.each((idx, btn) => {
        const btnText = Cypress.$(btn).text().trim();
        if (btnText.length > 0 && idx < 20) {
          cy.log(`   ${idx + 1}. "${btnText.substring(0, 50)}"`);
        }
      });
      return null;
    }
  });
}

/**
 * Attempts to click a button by text with detailed error reporting
 */
export function clickButtonByText(
  text: string,
  options: { timeout?: number; force?: boolean } = {}
) {
  const { timeout = 5000, force = false } = options;

  cy.log(`\n🖱️  ATTEMPTING TO CLICK BUTTON: "${text}"`);

  cy.get("button", { timeout }).then(($buttons) => {
    const button = $buttons.toArray().find((btn) =>
      Cypress.$(btn).text().includes(text)
    );

    if (!button) {
      cy.log(
        `✗ Button with text "${text}" not found. Available buttons:`
      );
      $buttons.each((idx, btn) => {
        const btnText = Cypress.$(btn).text().trim();
        if (btnText && idx < 10) {
          cy.log(`   ${idx}. "${btnText}"`);
        }
      });
      throw new Error(`Button with text "${text}" not found`);
    }

    const $btn = Cypress.$(button);
    cy.log(`✓ Button found: "${$btn.text().trim()}"`);
    cy.log(`  Visible: ${$btn.is(":visible")}`);
    cy.log(`  Clicking...`);

    cy.wrap(button)
      .click({ force })
      .then(() => {
        cy.log(`✓ Click successful`);
      })
      .catch((err) => {
        cy.log(`✗ Click failed: ${err.message}`);
        throw err;
      });
  });
}

/**
 * Comprehensive health check for tab buttons
 */
export function healthCheckTabButtons() {
  cy.log("\n🏥 TAB BUTTONS HEALTH CHECK\n");

  cy.get("body").then(() => {
    // Check 1: Buttons exist
    cy.get("button").should("have.length.greaterThan", 0);
    cy.log("✓ Buttons exist in DOM");

    // Check 2: Find tab buttons
    cy.get("button").then(($buttons) => {
      const tabButtons = $buttons.toArray().filter((btn) => {
        const text = Cypress.$(btn).text();
        return (
          text.includes("Entradas") ||
          text.includes("Saída Manual") ||
          text.includes("Nota Fiscal")
        );
      });

      if (tabButtons.length === 3) {
        cy.log("✓ All 3 tab buttons found");
      } else {
        cy.log(`⚠️  Found ${tabButtons.length} tab buttons (expected 3)`);
      }
    });

    // Check 3: Tab container exists
    cy.get("aside div.flex.rounded-2xl").then(($container) => {
      if ($container.length > 0) {
        cy.log("✓ Tab container found (aside > div.flex.rounded-2xl)");
      } else {
        cy.log("✗ Tab container not found");
      }
    });

    // Check 4: Page title loaded
    cy.contains("Fluxo Financeiro").then(() => {
      cy.log("✓ Page fully loaded (Fluxo Financeiro title visible)");
    });

    cy.log("\n");
  });
}
