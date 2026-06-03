/**
 * CYPRESS CONSOLE SNIPPET - Copy & paste directly into Cypress console to debug immediately
 * 
 * Usage:
 * 1. Open Cypress test runner
 * 2. Right-click on page -> Inspect (or press F12)
 * 3. Open DevTools Console tab
 * 4. Copy entire code block below
 * 5. Paste into console and press Enter
 * 6. Read output
 */

// ============= PASTE THIS INTO CYPRESS CONSOLE =============

(function debugTabButtons() {
  console.log("%c╔═══════════════════════════════════════════════════════╗", "color: #00ff00; font-weight: bold; font-size: 14px;");
  console.log("%c║  TAB BUTTONS IMMEDIATE DEBUG - CYPRESS CONSOLE       ║", "color: #00ff00; font-weight: bold; font-size: 14px;");
  console.log("%c╚═══════════════════════════════════════════════════════╝", "color: #00ff00; font-weight: bold; font-size: 14px;");

  // 1. Count all buttons
  const allButtons = document.querySelectorAll("button");
  console.log(`\n%c1️⃣  TOTAL BUTTONS ON PAGE: ${allButtons.length}`, "font-weight: bold; color: #0066ff;");

  // 2. Find tab buttons
  console.log(`%c\n2️⃣  SEARCHING FOR TAB BUTTONS...`, "font-weight: bold; color: #0066ff;");
  const tabLabels = ["Entradas", "Saída Manual", "Nota Fiscal"];
  const tabButtons = [];

  allButtons.forEach((btn, idx) => {
    const text = btn.textContent.trim();
    tabLabels.forEach((label) => {
      if (text.includes(label)) {
        tabButtons.push({ btn, idx, label, text });
        console.log(`   ✓ Found at index ${idx}: "${text}"`);
      }
    });
  });

  if (tabButtons.length === 0) {
    console.log(`   %c✗ NO TAB BUTTONS FOUND!`, "color: red; font-weight: bold;");
    console.log(`\n   Available button texts:`);
    allButtons.forEach((btn, idx) => {
      const text = btn.textContent.trim();
      if (text && text.length > 0 && idx < 20) {
        console.log(`     ${idx}. "${text.substring(0, 50)}"`);
      }
    });
  } else {
    console.log(`   %c✓ FOUND ${tabButtons.length} tab button(s)`, "color: green; font-weight: bold;");
  }

  // 3. Inspect each tab button
  if (tabButtons.length > 0) {
    console.log(`\n%c3️⃣  TAB BUTTON DETAILS:`, "font-weight: bold; color: #0066ff;");
    tabButtons.forEach(({ btn, idx, label, text }, btnIdx) => {
      const computed = window.getComputedStyle(btn);
      const rect = btn.getBoundingClientRect();

      console.group(`   Button ${btnIdx + 1}: "${label}"`);
      console.log(`Display: ${computed.display}`);
      console.log(`Visibility: ${computed.visibility}`);
      console.log(`Opacity: ${computed.opacity}`);
      console.log(`Pointer Events: ${computed.pointerEvents}`);
      console.log(`Position: x=${Math.round(rect.x)}, y=${Math.round(rect.y)}`);
      console.log(`Size: ${Math.round(rect.width)}×${Math.round(rect.height)}`);
      console.log(`Is Visible: ${window.getComputedStyle(btn).display !== "none" && window.getComputedStyle(btn).visibility !== "hidden" && window.getComputedStyle(btn).opacity !== "0"}`);
      console.log(`Full text: "${text}"`);
      console.log(`HTML: ${btn.outerHTML.substring(0, 150)}...`);
      console.groupEnd();
    });
  }

  // 4. Check tab container
  console.log(`\n%c4️⃣  TAB CONTAINER STRUCTURE:`, "font-weight: bold; color: #0066ff;");
  const aside = document.querySelector("aside");
  if (aside) {
    console.log(`✓ Aside element found`);
    const tabContainer = aside.querySelector("div.flex.rounded-2xl");
    if (tabContainer) {
      console.log(`✓ Tab container found (div.flex.rounded-2xl)`);
      const containerButtons = tabContainer.querySelectorAll("button");
      console.log(`  Contains ${containerButtons.length} buttons`);
      containerButtons.forEach((btn, idx) => {
        console.log(`    ${idx}: "${btn.textContent.trim()}"`);
      });
    } else {
      console.log(`✗ Tab container NOT found`);
      console.log(`  Aside children:`, aside.children.length);
      Array.from(aside.children).forEach((child, idx) => {
        console.log(`    ${idx}: ${child.tagName}`);
      });
    }
  } else {
    console.log(`✗ Aside element not found`);
  }

  // 5. Check Next.js/Hydration state
  console.log(`\n%c5️⃣  NEXT.JS / HYDRATION STATE:`, "font-weight: bold; color: #0066ff;");
  console.log(`Window.__NEXT_DATA__: ${window.__NEXT_DATA__ ? "✓ EXISTS" : "✗ NOT FOUND"}`);
  console.log(`Window.__REACT_DEVTOOLS_GLOBAL_HOOK__: ${window.__REACT_DEVTOOLS_GLOBAL_HOOK__ ? "✓ EXISTS" : "✗ NOT FOUND"}`);
  console.log(`Document readyState: ${document.readyState}`);

  // 6. Test cy.contains behavior
  console.log(`\n%c6️⃣  TESTING CY.CONTAINS MATCHING:`, "font-weight: bold; color: #0066ff;");
  tabLabels.forEach((label) => {
    const matches = Array.from(allButtons).filter((btn) =>
      btn.textContent.includes(label)
    );
    console.log(`   "cy.contains('button', '${label}')": ${matches.length > 0 ? "✓ Should match" : "✗ Won't match"}`);
    if (matches.length > 0) {
      matches.forEach((btn) => {
        console.log(`     - Full text: "${btn.textContent.trim()}"`);
      });
    }
  });

  // 7. Try manual click
  console.log(`\n%c7️⃣  TESTING MANUAL CLICK:`, "font-weight: bold; color: #0066ff;");
  if (tabButtons.length > 0) {
    const firstTabBtn = tabButtons[0].btn;
    console.log(`   Attempting to click first tab button: "${tabButtons[0].label}"`);
    try {
      firstTabBtn.click();
      console.log(`   ✓ Click executed successfully`);
    } catch (e) {
      console.log(`   ✗ Click failed: ${e.message}`);
    }
  }

  console.log(`\n%c════════════════════════════════════════════════════════`, "color: #00ff00; font-weight: bold;");
  console.log(`%cDiagnostic complete. Check output above for issues.`, "font-weight: bold; color: #ff6600;");
})();

// ============= END OF SNIPPET =============

/**
 * ALTERNATIVE SNIPPETS FOR SPECIFIC SCENARIOS
 */

// If you need to click a tab and monitor it:
/*
const clickTabAndMonitor = (labelText) => {
  const buttons = document.querySelectorAll("button");
  const tabBtn = Array.from(buttons).find(btn => btn.textContent.includes(labelText));
  if (tabBtn) {
    console.log("Before click:", {
      visible: tabBtn.offsetParent !== null,
      opacity: window.getComputedStyle(tabBtn).opacity,
      display: window.getComputedStyle(tabBtn).display
    });
    tabBtn.click();
    console.log("After click:", { clicked: true });
  } else {
    console.log("Button not found:", labelText);
  }
};

clickTabAndMonitor("Entradas");
*/

// If you need to list all button properties:
/*
const inspectAllButtons = () => {
  const buttons = document.querySelectorAll("button");
  console.table(
    Array.from(buttons).map(btn => ({
      text: btn.textContent.trim().substring(0, 30),
      visible: btn.offsetParent !== null,
      display: window.getComputedStyle(btn).display,
      opacity: window.getComputedStyle(btn).opacity,
      classes: btn.className
    }))
  );
};

inspectAllButtons();
*/
