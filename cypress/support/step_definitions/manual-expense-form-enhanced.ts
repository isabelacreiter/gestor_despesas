/**
 * Utility functions for tab button interaction (não registra step definitions —
 * o step "clico na aba {string}" está em common.ts).
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
