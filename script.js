(function () {
  const PROVIDERS = {
    MOBILE: ["Uzmobile", "Ucell", "Beeline", "Mobiuz", "Perfectum"],
    INTERNET: ["Uztelecom", "TPS", "Sarkor Telecom", "Sharq Telecom"],
    ELECTRICITY: ["HET (Hududiy elektr tarmoqlari)"],
    GAS: ["Hududgazta'minot"],
    WATER: ["Uzsuvta'minot"],
    TV: ["UZDIGITAL TV", "Telesat"],
    QR: ["NOVAPAY Merchant QR", "Humol / Uzcard QR Demo"],
  };

  const I18N = {
    uz: {
      sandbox: "SANDBOX REJIM • HAQIQIY PUL O'TKAZILMAYDI (SIMULYATSIYA)",
      eyebrow: "O'zbekiston raqamli to'lov va moliya ekotizimi",
      heroTitle: "Kelajak moliyaviy boshqaruvi",
      heroSubtitle: "Bir zumda mobil va kommunal to'lovlar, QR-hisob-kitoblar hamda savdo analitikasi bitta oynada.",
      balanceLabel: "Asosiy hamyon balansi",
      incomeLabel: "Oylik tushum",
      expenseLabel: "Oylik xarajat",
      payCta: "To'lovga o'tish",
      bizCta: "Biznes paneli",
      recentTitle: "So'nggi operatsiyalar",
      aiTitle: "NOVAPAY AI Yordamchi",
      aiPlaceholder: "To'lovlar, QR yoki bo'limlar haqida so'rang...",
      aiSend: "Yuborish",
      currency: "so'm",
    },
    ru: {
      sandbox: "SANDBOX РЕЖИМ • РЕАЛЬНЫЕ СРЕДСТВА НЕ СПИСЫВАЮТСЯ (СИМУЛЯЦИЯ)",
      eyebrow: "Платформа цифровых платежей и финансов Узбекистана",
      heroTitle: "Финансовая платформа нового поколения",
      heroSubtitle: "Оплата связи и коммунальных услуг, QR-сценарии и аналитика для бизнеса в UZS.",
      balanceLabel: "Баланс кошелька",
      incomeLabel: "Приход за месяц",
      expenseLabel: "Расход за месяц",
      payCta: "К платежам",
      bizCta: "Бизнес-панель",
      recentTitle: "Последние операции",
      aiTitle: "Ассистент NOVAPAY AI",
      aiPlaceholder: "Спросите про платежи, QR или разделы...",
      aiSend: "Отправить",
      currency: "сум",
    },
    en: {
      sandbox: "SANDBOX MODE • NO REAL FUNDS SETTLED (SIMULATION)",
      eyebrow: "Uzbekistan Digital Payments & Financial Platform",
      heroTitle: "Next-generation financial control",
      heroSubtitle: "Unified bill and mobile flows, QR checkout tools, and merchant telemetry in UZS.",
      balanceLabel: "Primary wallet balance",
      incomeLabel: "Monthly inflow",
      expenseLabel: "Monthly outflow",
      payCta: "Open Payments",
      bizCta: "Business Suite",
      recentTitle: "Recent activity",
      aiTitle: "NOVAPAY AI Assistant",
      aiPlaceholder: "Ask about bills, QR tools, or sections...",
      aiSend: "Send",
      currency: "UZS",
    },
  };

  const state = {
    section: "HOME",
    lang: "uz",
    category: "MOBILE",
    authMode: "login",
    aiTone: "concise",
    user: {
      fullName: "Aziza Karimova",
      phone: "+998 90 123 45 67",
      email: "aziza@novapay.uz",
      region: "Toshkent shahri",
      balanceUzs: 4850000,
    },
    transactions: [
      {
        id: "tx-1",
        receiptCode: "NVP-SBX-9001",
        category: "MOBILE",
        provider: "Uzmobile",
        accountRef: "998901234567",
        amountUzs: 55000,
        direction: "OUT",
        status: "SANDBOX_COMPLETED",
      },
      {
        id: "tx-2",
        receiptCode: "NVP-SBX-9002",
        category: "ELECTRICITY",
        provider: "HET (Hududiy elektr tarmoqlari)",
        accountRef: "011048921",
        amountUzs: 142000,
        direction: "OUT",
        status: "SANDBOX_COMPLETED",
      },
    ],
    savedPayees: [
      {
        id: "sp-1",
        label: "Home Fiber Internet",
        category: "INTERNET",
        provider: "Uztelecom",
        accountRef: "002849102",
      },
    ],
    recurringRules: [
      {
        id: "rc-1",
        title: "Monthly Mobile Bundle",
        category: "MOBILE",
        provider: "Ucell",
        accountRef: "998935551122",
        amountUzs: 60000,
        dayOfMonth: 5,
      },
    ],
    business: {
      name: "NovaCommerce Toshkent LLC",
      inn: "309841256",
      terminal: "NVP-TERM-8841",
      dailySales: 18420000,
      monthSales: 412950000,
      activeQr: 14,
      series: [
        { label: "Mon", revenue: 54200000 },
        { label: "Tue", revenue: 61800000 },
        { label: "Wed", revenue: 58900000 },
        { label: "Thu", revenue: 69400000 },
        { label: "Fri", revenue: 78500000 },
        { label: "Sat", revenue: 51150000 },
        { label: "Sun", revenue: 39000000 },
      ],
      customers: [
        { name: "Nodirbek Alimov", segment: "VIP Repeat", visits: 19, volume: 6420000 },
        { name: "Madina Rasulova", segment: "QR Regular", visits: 12, volume: 3980000 },
        { name: "Sardorbek Tursunov", segment: "Corporate", visits: 8, volume: 9150000 },
      ],
    },
    chatHistory: [
      {
        role: "assistant",
        text: "Salom! Men NOVAPAY AI yordamchisiman. To'lovlar, QR-kodlar yoki bo'limlar bo'yicha yordam beraman.",
      },
    ],
  };

  function formatMoney(amount) {
    const num = Math.max(0, Math.round(Number(amount) || 0));
    const spaced = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `${spaced} ${I18N[state.lang].currency}`;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setSection(nextSection, presetCategory) {
    if (presetCategory && PROVIDERS[presetCategory]) {
      state.category = presetCategory;
      syncCategoryUI();
    }
    state.section = nextSection;

    document.querySelectorAll(".page-section").forEach((el) => {
      el.classList.toggle("is-visible", el.id === `section-${nextSection}`);
    });

    document.querySelectorAll("[data-nav]").forEach((btn) => {
      const target = btn.getAttribute("data-nav");
      btn.classList.toggle("is-active", target === nextSection);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function applyLanguage(lang) {
    state.lang = lang;
    const dict = I18N[lang];

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
    });

    const mapText = [
      ["sandboxBanner", dict.sandbox],
      ["heroEyebrow", dict.eyebrow],
      ["heroTitle", dict.heroTitle],
      ["heroSubtitle", dict.heroSubtitle],
      ["balanceLabel", dict.balanceLabel],
      ["incomeLabel", dict.incomeLabel],
      ["expenseLabel", dict.expenseLabel],
      ["heroPayCta", dict.payCta],
      ["heroBizCta", dict.bizCta],
      ["recentActivityTitle", dict.recentTitle],
      ["aiDrawerTitle", dict.aiTitle],
      ["aiFabLabel", dict.aiTitle.replace(" Yordamchi", "").replace(" Ассистент", "").replace(" Assistant", "")],
      ["aiSendBtn", dict.aiSend],
    ];

    mapText.forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    });

    const aiInput = document.getElementById("aiInput");
    if (aiInput) aiInput.placeholder = dict.aiPlaceholder;

    renderAll();
  }

  function syncCategoryUI() {
    document.querySelectorAll(".cat-btn").forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-cat") === state.category);
    });

    const providerSelect = document.getElementById("providerSelect");
    const list = PROVIDERS[state.category] || PROVIDERS.MOBILE;
    if (providerSelect) {
      providerSelect.innerHTML = list
        .map((p) => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`)
        .join("");
    }

    const refLabel = document.getElementById("accountRefLabel");
    const refInput = document.getElementById("accountRefInput");
    const formHeading = document.getElementById("paymentFormHeading");

    if (refLabel) {
      if (state.category === "MOBILE") refLabel.textContent = "Telefon raqami (+998...)";
      else if (state.category === "QR") refLabel.textContent = "QR Terminal / Invoice Code";
      else refLabel.textContent = "Shaxsiy hisob / Hisoblagich ID";
    }
    if (refInput) {
      if (state.category === "MOBILE") refInput.value = "998901234567";
      else if (state.category === "INTERNET") refInput.value = "002849102";
      else if (state.category === "QR") refInput.value = "QR-TERM-UZ-1042";
      else refInput.value = "011048921";
    }
    if (formHeading) {
      formHeading.textContent = `${state.category} — Sandbox Checkout`;
    }

    updateQrPreview();
  }

  function updateQrPreview() {
    const provider = document.getElementById("providerSelect")?.value || "Uzmobile";
    const refVal = document.getElementById("accountRefInput")?.value || "998901234567";
    const qrProvider = document.getElementById("qrProviderLabel");
    const qrRef = document.getElementById("qrRefLabel");
    const qrMatrix = document.getElementById("qrMatrix");

    if (qrProvider) qrProvider.textContent = provider;
    if (qrRef) qrRef.textContent = `Ref: ${refVal}`;

    if (qrMatrix) {
      const seedString = `${provider}:${refVal}`;
      let hash = 0;
      for (let i = 0; i < seedString.length; i += 1) {
        hash = (hash * 31 + seedString.charCodeAt(i)) >>> 0;
      }
      const cells = [];
      for (let i = 0; i < 25; i += 1) {
        const isDark = ((hash >> (i % 24)) & 1) === 1 || i % 4 === 0;
        cells.push(`<span class="qr-cell ${isDark ? "" : "is-light"}"></span>`);
      }
      qrMatrix.innerHTML = cells.join("");
    }
  }

  function renderHomeMetricsAndRecent() {
    const totalOut = state.transactions
      .filter((t) => t.direction === "OUT")
      .reduce((acc, t) => acc + t.amountUzs, 0);

    const balEl = document.getElementById("homeBalanceValue");
    const cardBalEl = document.getElementById("cardBalanceText");
    const cardHolderEl = document.getElementById("cardHolderName");
    const incEl = document.getElementById("homeIncomeValue");
    const expEl = document.getElementById("homeExpenseValue");

    if (balEl) balEl.textContent = formatMoney(state.user.balanceUzs);
    if (cardBalEl) cardBalEl.textContent = formatMoney(state.user.balanceUzs);
    if (cardHolderEl) cardHolderEl.textContent = state.user.fullName;
    if (incEl) incEl.textContent = `+${formatMoney(12400000)}`;
    if (expEl) expEl.textContent = `-${formatMoney(totalOut)}`;

    const listEl = document.getElementById("homeRecentList");
    if (listEl) {
      listEl.innerHTML = state.transactions
        .slice(0, 4)
        .map(
          (tx) => `
          <div class="activity-row">
            <div>
              <strong>${escapeHtml(tx.provider)} • ${escapeHtml(tx.category)}</strong>
              <div class="mono-num muted-text small-note">${escapeHtml(tx.accountRef)} • ${escapeHtml(tx.receiptCode)}</div>
            </div>
            <div class="text-right">
              <div class="mono-num">-${formatMoney(tx.amountUzs)}</div>
              <span class="chip-tag">${escapeHtml(tx.status)}</span>
            </div>
          </div>
        `
        )
        .join("");
    }
  }

  function renderPaymentsSection() {
    const savedList = document.getElementById("savedPayeesList");
    if (savedList) {
      savedList.innerHTML = state.savedPayees
        .map(
          (sp) => `
          <div class="stack-item">
            <div>
              <strong>${escapeHtml(sp.label)}</strong>
              <div class="mono-num muted-text small-note">${escapeHtml(sp.provider)} • ${escapeHtml(sp.accountRef)}</div>
            </div>
            <button type="button" class="btn-secondary use-payee-btn" data-payee-id="${escapeHtml(sp.id)}">Use</button>
          </div>
        `
        )
        .join("");

      savedList.querySelectorAll(".use-payee-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const found = state.savedPayees.find((item) => item.id === btn.getAttribute("data-payee-id"));
          if (!found) return;
          state.category = found.category;
          syncCategoryUI();
          const provSel = document.getElementById("providerSelect");
          const refInp = document.getElementById("accountRefInput");
          if (provSel) provSel.value = found.provider;
          if (refInp) refInp.value = found.accountRef;
          updateQrPreview();
        });
      });
    }

    const recList = document.getElementById("recurringRulesList");
    if (recList) {
      recList.innerHTML = state.recurringRules
        .map(
          (r) => `
          <div class="stack-item">
            <div>
              <strong>${escapeHtml(r.title)}</strong>
              <div class="muted-text small-note">Day ${r.dayOfMonth} • ${escapeHtml(r.provider)}</div>
            </div>
            <span class="mono-num">${formatMoney(r.amountUzs)}</span>
          </div>
        `
        )
        .join("");
    }

    const query = (document.getElementById("txSearchInput")?.value || "").toLowerCase().trim();
    const statusFilter = document.getElementById("txStatusFilter")?.value || "ALL";
    const tbody = document.getElementById("paymentsHistoryBody");

    if (tbody) {
      const filtered = state.transactions.filter((tx) => {
        const matchesStatus = statusFilter === "ALL" || tx.status === statusFilter;
        const matchesQuery =
          !query ||
          tx.provider.toLowerCase().includes(query) ||
          tx.accountRef.toLowerCase().includes(query) ||
          tx.receiptCode.toLowerCase().includes(query);
        return matchesStatus && matchesQuery;
      });

      tbody.innerHTML = filtered
        .map(
          (tx) => `
          <tr>
            <td class="mono-num">${escapeHtml(tx.receiptCode)}</td>
            <td>${escapeHtml(tx.provider)}</td>
            <td class="mono-num">${escapeHtml(tx.accountRef)}</td>
            <td><span class="chip-tag">${escapeHtml(tx.status)}</span></td>
            <td class="text-right mono-num">${formatMoney(tx.amountUzs)}</td>
          </tr>
        `
        )
        .join("");
    }
  }

  function renderBusinessSection() {
    const nameEl = document.getElementById("bizNameText");
    const metaEl = document.getElementById("bizMetaText");
    const dailyEl = document.getElementById("bizDailySales");
    const monthEl = document.getElementById("bizMonthSales");
    const qrCntEl = document.getElementById("bizActiveQr");

    if (nameEl) nameEl.textContent = state.business.name;
    if (metaEl) metaEl.textContent = `INN: ${state.business.inn} • Terminal: ${state.business.terminal}`;
    if (dailyEl) dailyEl.textContent = formatMoney(state.business.dailySales);
    if (monthEl) monthEl.textContent = formatMoney(state.business.monthSales);
    if (qrCntEl) qrCntEl.textContent = `${state.business.activeQr} QR`;

    const maxRev = Math.max(...state.business.series.map((s) => s.revenue), 1);
    const chartEl = document.getElementById("bizBarChart");
    if (chartEl) {
      chartEl.innerHTML = state.business.series
        .map((pt) => {
          const pct = Math.max(15, Math.round((pt.revenue / maxRev) * 100));
          return `
            <div class="bar-col">
              <div class="bar-fill" style="height:${pct}%" title="${pt.label}: ${formatMoney(pt.revenue)}"></div>
              <span class="bar-label">${escapeHtml(pt.label)}</span>
            </div>
          `;
        })
        .join("");
    }

    const qrAmt = Number(document.getElementById("bizQrAmountInput")?.value || 0);
    const qrPayload = document.getElementById("bizQrPayload");
    if (qrPayload) {
      qrPayload.textContent = `NOVAPAY://QR?merchant=${state.business.inn}&terminal=${state.business.terminal}&amount=${qrAmt}`;
    }

    const custBody = document.getElementById("bizCustomersBody");
    if (custBody) {
      custBody.innerHTML = state.business.customers
        .map(
          (c) => `
          <tr>
            <td>${escapeHtml(c.name)}</td>
            <td>${escapeHtml(c.segment)}</td>
            <td class="mono-num">${c.visits}</td>
            <td class="text-right mono-num">${formatMoney(c.volume)}</td>
          </tr>
        `
        )
        .join("");
    }
  }

  function renderChatMessages() {
    const box = document.getElementById("aiMessages");
    if (!box) return;
    box.innerHTML = state.chatHistory
      .map(
        (m) => `<div class="ai-bubble ${m.role === "user" ? "user" : "assistant"}">${escapeHtml(m.text)}</div>`
      )
      .join("");
    box.scrollTop = box.scrollHeight;
  }

  function generateAssistantReply(promptText) {
    const q = promptText.toLowerCase();
    const detailPrefix = state.aiTone === "detailed" ? "[Detailed Mode] " : "";

    if (state.lang === "ru") {
      if (q.includes("qr") || q.includes("оплат") || q.includes("счет")) {
        return `${detailPrefix}В разделе PAYMENTS доступны мобильная связь, интернет, коммунальные услуги, QR-оплата и история чеков в sandbox-режиме.`;
      }
      if (q.includes("бизнес") || q.includes("выруч") || q.includes("мерчант")) {
        return `${detailPrefix}Раздел BUSINESS содержит аналитику продаж за 7 дней, QR-инструменты, управление клиентами и выгрузку отчётов в CSV.`;
      }
      return `${detailPrefix}Ассистент NOVAPAY готов помочь с разделами HOME, PAYMENTS, BUSINESS и PROFILE.`;
    }

    if (state.lang === "en") {
      if (q.includes("qr") || q.includes("pay") || q.includes("bill") || q.includes("utility")) {
        return `${detailPrefix}PAYMENTS supports mobile top-ups, internet, electricity, gas, water, TV, QR checkout, saved payees, recurring rules, and sandbox receipts.`;
      }
      if (q.includes("business") || q.includes("revenue") || q.includes("merchant")) {
        return `${detailPrefix}BUSINESS includes 7-day UZS revenue analytics, dynamic QR invoice strings, customer tables, and CSV export.`;
      }
      return `${detailPrefix}NOVAPAY AI can guide you through HOME, PAYMENTS, BUSINESS, and PROFILE.`;
    }

    if (q.includes("qr") || q.includes("to'lov") || q.includes("tolov") || q.includes("kommunal")) {
      return `${detailPrefix}PAYMENTS bo'limida mobil aloqa, internet, elektr, gaz, suv, TV, QR-to'lov, saqlangan to'lovlar va cheklar sandbox rejimida ishlaydi.`;
    }
    if (q.includes("biznes") || q.includes("tushum") || q.includes("savdo")) {
      return `${detailPrefix}BUSINESS bo'limida 7 kunlik savdo diagrammasi, QR-hisob-faktura matni, mijozlar ro'yxati va CSV hisobot eksporti mavjud.`;
    }
    return `${detailPrefix}Men NOVAPAY AI yordamchisiman. HOME, PAYMENTS, BUSINESS va PROFILE bo'limlari bo'yicha yordam beraman.`;
  }

  function submitAiPrompt(text) {
    const clean = text.trim();
    if (!clean) return;
    state.chatHistory.push({ role: "user", text: clean });
    state.chatHistory.push({ role: "assistant", text: generateAssistantReply(clean) });
    renderChatMessages();
  }

  function renderAll() {
    renderHomeMetricsAndRecent();
    renderPaymentsSection();
    renderBusinessSection();
    renderChatMessages();
  }

  function bindEvents() {
    document.querySelectorAll("[data-nav]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-nav");
        const presetCat = btn.getAttribute("data-preset-cat");
        if (target) setSection(target, presetCat || undefined);
      });
    });

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");
        if (lang && I18N[lang]) applyLanguage(lang);
      });
    });

    document.querySelectorAll(".cat-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.getAttribute("data-cat");
        if (cat && PROVIDERS[cat]) {
          state.category = cat;
          syncCategoryUI();
        }
      });
    });

    document.getElementById("providerSelect")?.addEventListener("change", updateQrPreview);
    document.getElementById("accountRefInput")?.addEventListener("input", updateQrPreview);

    document.querySelectorAll(".preset-btn[data-amount]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const amt = btn.getAttribute("data-amount");
        const inp = document.getElementById("amountInput");
        if (inp && amt) inp.value = amt;
      });
    });

    document.getElementById("paymentForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const provider = document.getElementById("providerSelect")?.value || "Uzmobile";
      const accountRef = (document.getElementById("accountRefInput")?.value || "").trim();
      const amountUzs = Math.max(1000, Number(document.getElementById("amountInput")?.value || 0));
      if (!accountRef) return;

      const receiptCode = `NVP-SBX-${Date.now().toString(36).toUpperCase()}`;
      const tx = {
        id: `tx-${Date.now()}`,
        receiptCode,
        category: state.category,
        provider,
        accountRef,
        amountUzs,
        direction: "OUT",
        status: "SANDBOX_COMPLETED",
      };

      state.transactions.unshift(tx);
      state.user.balanceUzs = Math.max(0, state.user.balanceUzs - amountUzs);

      const receiptCard = document.getElementById("receiptCard");
      if (receiptCard) {
        receiptCard.classList.remove("hidden");
        const rCode = document.getElementById("receiptCodeText");
        const rMeta = document.getElementById("receiptMetaText");
        const rAmt = document.getElementById("receiptAmountText");
        if (rCode) rCode.textContent = `Receipt: ${receiptCode}`;
        if (rMeta) rMeta.textContent = `${provider} • ${accountRef}`;
        if (rAmt) rAmt.textContent = formatMoney(amountUzs);
      }

      renderAll();
    });

    document.getElementById("savedPayeeForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const labelInp = document.getElementById("savedPayeeLabelInput");
      const label = (labelInp?.value || "").trim();
      const provider = document.getElementById("providerSelect")?.value || "Uzmobile";
      const accountRef = (document.getElementById("accountRefInput")?.value || "").trim();
      if (!label || !accountRef) return;

      state.savedPayees.unshift({
        id: `sp-${Date.now()}`,
        label,
        category: state.category,
        provider,
        accountRef,
      });
      if (labelInp) labelInp.value = "";
      renderPaymentsSection();
    });

    document.getElementById("recurringForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const titleInp = document.getElementById("recurringTitleInput");
      const daySel = document.getElementById("recurringDaySelect");
      const title = (titleInp?.value || "").trim();
      const dayOfMonth = Number(daySel?.value || 5);
      const provider = document.getElementById("providerSelect")?.value || "Uzmobile";
      const accountRef = (document.getElementById("accountRefInput")?.value || "").trim();
      const amountUzs = Math.max(1000, Number(document.getElementById("amountInput")?.value || 50000));
      if (!title) return;

      state.recurringRules.unshift({
        id: `rc-${Date.now()}`,
        title,
        category: state.category,
        provider,
        accountRef,
        amountUzs,
        dayOfMonth,
      });
      if (titleInp) titleInp.value = "";
      renderPaymentsSection();
    });

    document.getElementById("txSearchInput")?.addEventListener("input", renderPaymentsSection);
    document.getElementById("txStatusFilter")?.addEventListener("change", renderPaymentsSection);

    document.getElementById("terminalToggleBtn")?.addEventListener("click", (e) => {
      const btn = e.currentTarget;
      const isOnline = btn.classList.toggle("is-online");
      btn.classList.toggle("is-standby", !isOnline);
      btn.textContent = isOnline ? "● Terminal Online" : "○ Terminal Standby";
    });

    document.getElementById("bizQrAmountInput")?.addEventListener("input", renderBusinessSection);

    document.getElementById("exportBizCsvBtn")?.addEventListener("click", () => {
      const lines = [
        ["Day", "Revenue_UZS"],
        ...state.business.series.map((s) => [s.label, String(s.revenue)]),
      ];
      const csv = lines.map((row) => row.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `novapay-report-${state.business.inn}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      const notice = document.getElementById("bizExportNotice");
      if (notice) {
        notice.textContent = `CSV report exported for ${state.business.name}.`;
        notice.classList.remove("hidden");
      }
    });

    const modeLoginBtn = document.getElementById("modeLoginBtn");
    const modeRegisterBtn = document.getElementById("modeRegisterBtn");
    const regExtra = document.getElementById("registerExtraFields");
    const authTitle = document.getElementById("authTitle");
    const authSubmitBtn = document.getElementById("authSubmitBtn");

    modeLoginBtn?.addEventListener("click", () => {
      state.authMode = "login";
      modeLoginBtn.classList.add("is-active");
      modeRegisterBtn?.classList.remove("is-active");
      regExtra?.classList.add("hidden");
      if (authTitle) authTitle.textContent = "Account Sign In";
      if (authSubmitBtn) authSubmitBtn.textContent = "Sign In";
    });

    modeRegisterBtn?.addEventListener("click", () => {
      state.authMode = "register";
      modeRegisterBtn.classList.add("is-active");
      modeLoginBtn?.classList.remove("is-active");
      regExtra?.classList.remove("hidden");
      if (authTitle) authTitle.textContent = "Create NOVAPAY Account";
      if (authSubmitBtn) authSubmitBtn.textContent = "Register Account";
    });

    document.getElementById("authForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("authEmailInput")?.value || "";
      if (state.authMode === "register") {
        const regName = document.getElementById("regNameInput")?.value || state.user.fullName;
        const regPhone = document.getElementById("regPhoneInput")?.value || state.user.phone;
        state.user.fullName = regName;
        state.user.phone = regPhone;
      }
      state.user.email = email;
      const statusMsg = document.getElementById("authStatusMsg");
      if (statusMsg) {
        statusMsg.textContent = `Active sandbox session for ${state.user.fullName} (${email}).`;
        statusMsg.classList.remove("hidden");
      }
      renderHomeMetricsAndRecent();
    });

    document.getElementById("personalInfoForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      state.user.fullName = document.getElementById("profNameInput")?.value || state.user.fullName;
      state.user.phone = document.getElementById("profPhoneInput")?.value || state.user.phone;
      state.user.region = document.getElementById("profRegionInput")?.value || state.user.region;
      renderHomeMetricsAndRecent();
    });

    document.querySelectorAll(".preset-btn[data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const nextLang = btn.getAttribute("data-lang");
        if (nextLang && I18N[nextLang]) applyLanguage(nextLang);
      });
    });

    document.querySelectorAll(".preset-btn[data-ai-tone]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tone = btn.getAttribute("data-ai-tone");
        if (!tone) return;
        state.aiTone = tone;
        document.querySelectorAll(".preset-btn[data-ai-tone]").forEach((b) => {
          b.classList.toggle("is-selected", b === btn);
        });
      });
    });

    const card3d = document.getElementById("smartCard3D");
    const cardShine = document.getElementById("smartCardShine");
    card3d?.addEventListener("mousemove", (e) => {
      const rect = card3d.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotY = (px - 0.5) * 22;
      const rotX = (0.5 - py) * 18;
      card3d.style.transform = `rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg)`;
      if (cardShine) {
        cardShine.style.background = `radial-gradient(circle at ${(px * 100).toFixed(0)}% ${(py * 100).toFixed(0)}%, rgba(34, 211, 238, 0.32), transparent 60%)`;
      }
    });
    card3d?.addEventListener("mouseleave", () => {
      card3d.style.transform = "rotateX(6deg) rotateY(-8deg)";
    });

    const aiDrawer = document.getElementById("aiDrawer");
    document.getElementById("aiToggleBtn")?.addEventListener("click", () => {
      aiDrawer?.classList.toggle("hidden");
      renderChatMessages();
    });
    document.getElementById("aiCloseBtn")?.addEventListener("click", () => {
      aiDrawer?.classList.add("hidden");
    });
    document.getElementById("aiExpandBtn")?.addEventListener("click", () => {
      aiDrawer?.classList.toggle("is-expanded");
    });

    document.getElementById("aiForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const inp = document.getElementById("aiInput");
      if (!inp) return;
      submitAiPrompt(inp.value);
      inp.value = "";
    });

    document.querySelectorAll("[data-ai-prompt]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const prompt = btn.getAttribute("data-ai-prompt");
        if (!prompt) return;
        aiDrawer?.classList.remove("hidden");
        submitAiPrompt(prompt);
      });
    });
  }

  syncCategoryUI();
  bindEvents();
  renderAll();
})();
