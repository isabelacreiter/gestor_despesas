/**
 * ENHANCED: Step definition for clicking tab buttons with diagnostic output
 * 
 * This file shows how to modify the existing step definition to include
 * helpful diagnostic output when button lookup fails.
 * 
 * Copy the When() definition to your manual-expense-form.ts file
 * to replace or supplement the existing one.
 */

import { When } from "@badeball/cypress-cucumber-preprocessor";
import {
  debugTabButtons,
  clickButtonByText,
} from "../support/tab-button-diagnostic-helper";

When("clico na aba {string}", (tabLabel: string) => {
  cy.log(`\n═══════════════════════════════════════════════════════`);
  cy.log(`  Attempting to click tab: "${tabLabel}"`);
  cy.log(`═══════════════════════════════════════════════════════\n`);

  // First, do a health check
  cy.get("button", { timeout: 10000 }).then(($buttons) => {
    const found = $buttons.toArray().find((btn) =>
      Cypress.$(btn).text().includes(tabLabel)
    );

    if (!found) {
      // Button not found! Run diagnostic
      cy.log(
        `\n⚠️  Button with text "${tabLabel}" not found! Running diagnostics...\n`
      );

      // Log all buttons
      cy.get("button").then((allButtons) => {
        cy.log(`Total buttons on page: ${allButtons.length}`);
        cy.log(`Button texts found:`);
        allButtons.each((idx, btn) => {
          const text = Cypress.$(btn).text().trim();
          if (text) {
            cy.log(`  ${idx}. "${text.substring(0, 60)}"`);
          }
        });
      });

      // Check tab container
      cy.get("aside").then(($aside) => {
        if ($aside.length > 0) {
          cy.log(`\nAside element found (${$aside.length})`);
          cy.get("aside div.flex.rounded-2xl").then(($container) => {
            if ($container.length > 0) {
              cy.log(
                `Tab container found with ${$container.find("button").length} buttons`
              );
              $container.find("button").each((idx, btn) => {
                cy.log(
                  `  Button ${idx}: "${Cypress.$(btn).text().trim()}"`
                );
              });
            } else {
              cy.log(
                `❌ Tab container NOT found (div.flex.rounded-2xl not in aside)`
              );
            }
          });
        } else {
          cy.log(`❌ Aside element not found`);
        }
      });

      // Take screenshot for debugging
      cy.screenshot(`debug-tab-click-failed-${tabLabel.replace(/\s/g, "-")}`);

      throw new Error(
        `Tab button "${tabLabel}" not found. See diagnostic output above.`
      );
    }

    // Button found, click it
    cy.log(`✓ Found button with text "${tabLabel}"`);
    cy.wrap(found).should("be.visible").click();
    cy.log(`✓ Successfully clicked tab "${tabLabel}"\n`);
  });
});

/**
 * ALTERNATIVE: More aggressive version that tries multiple approaches
 */
export function clickTabButtonRobust(tabLabel: string) {
  cy.log(`Clicking tab: "${tabLabel}"`);

  // Try approach 1: cy.contains
  cy.contains("button", tabLabel, { timeout: 3000 })
    .should("be.visible")
    .click()
    .then(() => {
      cy.log(`✓ Clicked via cy.contains("button", ...)`);
    })
    .catch(() => {
      cy.log(`cy.contains failed, trying alternative approach...`);

      // Try approach 2: Manual button search
      cy.get("button").then(($buttons) => {
        const button = $buttons.toArray().find((btn) =>
          Cypress.$(btn).text().includes(tabLabel)
        );

        if (button) {
          cy.wrap(button).click();
          cy.log(`✓ Clicked via manual button search`);
        } else {
          // Try approach 3: Using parent container
          cy.get("aside")
            .find("button")
            .then(($asideButtons) => {
              const asideButton = $asideButtons.toArray().find((btn) =>
                Cypress.$(btn).text().includes(tabLabel)
              );

              if (asideButton) {
                cy.wrap(asideButton).click();
                cy.log(`✓ Clicked via aside button search`);
              } else {
                throw new Error(
                  `Could not find button "${tabLabel}" with any approach`
                );
              }
            });
        }
      });
    });
}
