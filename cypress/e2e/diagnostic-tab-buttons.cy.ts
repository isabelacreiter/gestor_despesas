describe("Diagnostic: Tab Buttons DOM Inspection", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000", { timeout: 30000 });
    // Wait for the page title to ensure page has loaded
    cy.contains("Fluxo Financeiro", { timeout: 15000 }).should("exist");
    cy.wait(2000); // Additional wait for potential hydration
  });

  it("should inspect and log all buttons in the DOM", () => {
    // Take initial screenshot
    cy.screenshot("01-initial-page-load", { capture: "fullPage" });

    // Log all buttons on the page
    cy.get("button", { timeout: 10000 }).then(($buttons) => {
      cy.log(`Found ${$buttons.length} buttons total on the page`);
      
      $buttons.each((index, button) => {
        const $btn = Cypress.$(button);
        const text = $btn.text().trim();
        const innerHtml = $btn.html();
        const isVisible = $btn.is(":visible");
        const classes = $btn.attr("class");
        
        cy.log(`Button ${index}: "${text}"`);
        cy.log(`  Visible: ${isVisible}`);
        cy.log(`  Classes: ${classes}`);
        cy.log(`  HTML: ${innerHtml?.substring(0, 100)}`);
      });
    });
  });

  it("should find tab buttons using cy.contains", () => {
    const tabLabels = ["Entradas", "Saída Manual", "Nota Fiscal"];
    
    tabLabels.forEach((label) => {
      cy.log(`\n===== Searching for button with text: "${label}" =====`);
      
      // Try basic contains
      cy.get("button", { timeout: 5000 })
        .then(($buttons) => {
          const found = $buttons.toArray().find((btn) => {
            return Cypress.$(btn).text().includes(label);
          });
          
          if (found) {
            cy.log(`✓ Found button with label "${label}"`);
            cy.log(`  Full text: "${Cypress.$(found).text().trim()}"`);
            cy.log(`  Visible: ${Cypress.$(found).is(":visible")}`);
          } else {
            cy.log(`✗ Button with label "${label}" NOT FOUND`);
            cy.log(`  Available button texts:`);
            $buttons.toArray().forEach((btn, i) => {
              cy.log(`    ${i}: "${Cypress.$(btn).text().trim()}"`);
            });
          }
        });
    });
  });

  it("should check button visibility and CSS properties", () => {
    cy.get("button").then(($buttons) => {
      $buttons.each((index, button) => {
        const $btn = Cypress.$(button);
        const text = $btn.text().trim();
        
        if (
          text.includes("Entradas") ||
          text.includes("Saída Manual") ||
          text.includes("Nota Fiscal")
        ) {
          const computed = window.getComputedStyle(button);
          const rect = button.getBoundingClientRect();
          
          cy.log(`Button: "${text}"`);
          cy.log(`  Display: ${computed.display}`);
          cy.log(`  Visibility: ${computed.visibility}`);
          cy.log(`  Opacity: ${computed.opacity}`);
          cy.log(`  Pointer Events: ${computed.pointerEvents}`);
          cy.log(`  Position: ${JSON.stringify({
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left
          })}`);
        }
      });
    });
  });

  it("should scroll and take screenshots of tab button area", () => {
    // Find the tab container
    cy.get("aside").within(() => {
      cy.get("div").first().then(($tabContainer) => {
        const rect = $tabContainer[0].getBoundingClientRect();
        cy.log(`Tab container position: x=${rect.x}, y=${rect.y}, width=${rect.width}, height=${rect.height}`);
        
        // Scroll into view
        cy.wrap($tabContainer).scrollIntoView();
        cy.wait(500);
        
        // Screenshot the tab area
        cy.screenshot("02-tab-buttons-area", { capture: "viewport" });
      });
    });
  });

  it("should test cy.contains with different selectors", () => {
    cy.log("Testing different selector approaches:");
    
    // Approach 1: cy.contains with button
    cy.log("\n1. cy.contains('button', 'Entradas'):");
    cy.contains("button", "Entradas", { timeout: 3000 })
      .then(() => {
        cy.log("  ✓ SUCCESS");
      })
      .catch(() => {
        cy.log("  ✗ FAILED - Button not found with cy.contains");
      });
  });

  it("should inspect aside element structure", () => {
    cy.get("aside").then(($aside) => {
      cy.log("Aside element found:");
      cy.log(`  Classes: ${$aside.attr("class")}`);
      cy.log(`  Children count: ${$aside.children().length}`);
      
      $aside.children().each((index, child) => {
        const $child = Cypress.$(child);
        const classes = $child.attr("class");
        const children = $child.children().length;
        const text = $child.text().substring(0, 50);
        
        cy.log(`  Child ${index}:`);
        cy.log(`    Tag: ${child.tagName}`);
        cy.log(`    Classes: ${classes}`);
        cy.log(`    Children: ${children}`);
        cy.log(`    Text preview: "${text}..."`);
      });
    });
  });

  it("should check for hydration issues with data attributes", () => {
    // Check if there are any hydration-related data attributes
    cy.document().then((doc) => {
      const allElements = doc.querySelectorAll("[data-testid], [data-cy], [data-hydrated]");
      cy.log(`Found ${allElements.length} elements with test data attributes`);
      
      allElements.forEach((el, i) => {
        if (i < 10) {
          cy.log(`  ${i}: ${el.tagName} - ${el.getAttribute("data-testid") || el.getAttribute("data-cy") || "no test id"}`);
        }
      });
    });

    // Look for any hydration error indicators
    cy.get("body").then(($body) => {
      const hasHydrationError = $body.html().includes("hydration");
      cy.log(`Page contains hydration references: ${hasHydrationError}`);
    });
  });

  it("should verify tab button structure in detail", () => {
    // Get the first button in the tab group
    cy.get("aside div.flex.rounded-2xl").first().then(($tabGroup) => {
      cy.log("Tab group found:");
      cy.log(`  Classes: ${$tabGroup.attr("class")}`);
      cy.log(`  Direct button children: ${$tabGroup.find("button").length}`);
      
      // Log each button's complete structure
      $tabGroup.find("button").each((index, button) => {
        const $btn = Cypress.$(button);
        cy.log(`\n  Button ${index}:`);
        cy.log(`    HTML: ${$btn.html()}`);
        cy.log(`    Text content: "${$btn.text()}"`);
        cy.log(`    Class: ${$btn.attr("class")}`);
      });
      
      // Take a detailed screenshot
      cy.screenshot("03-tab-buttons-detailed", { capture: "viewport" });
    });
  });

  it("should attempt to click buttons and document behavior", () => {
    const labels = ["Entradas", "Saída Manual", "Nota Fiscal"];
    
    labels.forEach((label) => {
      cy.log(`\nAttempting to click button: "${label}"`);
      
      cy.get("button").then(($buttons) => {
        const button = $buttons.toArray().find((btn) =>
          Cypress.$(btn).text().includes(label)
        );
        
        if (button) {
          cy.wrap(button)
            .should("be.visible")
            .click()
            .then(() => {
              cy.log(`  ✓ Successfully clicked "${label}"`);
              cy.screenshot(`04-after-click-${label.replace(/\s+/g, "-")}`);
            })
            .catch((err) => {
              cy.log(`  ✗ Failed to click "${label}": ${err.message}`);
            });
        } else {
          cy.log(`  ✗ Could not find button with text "${label}"`);
        }
      });
    });
  });

  it("should check Next.js hydration state", () => {
    cy.window().then((win: any) => {
      // Check if Next.js is loaded
      cy.log(`Window.__NEXT_DATA__: ${win.__NEXT_DATA__ ? "EXISTS" : "NOT FOUND"}`);
      
      // Check React DevTools hook
      cy.log(`Window.__REACT_DEVTOOLS_GLOBAL_HOOK__: ${win.__REACT_DEVTOOLS_GLOBAL_HOOK__ ? "EXISTS" : "NOT FOUND"}`);
      
      // Try to access Next.js router
      if (win.next) {
        cy.log("Next.js is loaded");
      } else {
        cy.log("Next.js not detected");
      }
    });
  });
});
