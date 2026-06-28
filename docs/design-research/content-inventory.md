# SHINYLOGIC 顯藝科技 — Content Inventory
> Source: shiny3-content.md (49 KB, 7-page corpus)
> Purpose: Concept-independent fact catalog for full website redesign.
> Scope: 6 of 7 pages present in corpus; Home/index page NOT found in source material.

---

## Page 1 — Home / index

**Status: NOT IN CORPUS.** No home page content was found in the source file. All evidence of homepage-like content (hero headline, tagline, brand lockup) appears in the About page's opening sections; it is unclear whether shiny3 had a distinct index.html or redirected to about.html.

---

## Page 2 — About 關於 (`about.html`)

### Page purpose
Establish company identity, mission, and the full 6-layer architecture; present governance framework, delivery rhythm, leadership credentials, and key SLA numbers.

### Section list (in order)

| # | Heading (繁中 + English label) | Summary |
|---|---|---|
| Hero | 關於顯藝科技 · WHO WE ARE // SYSTEMS INTEGRATOR | Brand tagline + one-line positioning as IT/OT+AI full-stack systems integrator for HVM wafer fabs; two CTAs. |
| 01 | 使命與定位 / MISSION & POSITIONING | Positions as SI (not equipment vendor) for HVM fabs; introduces FAB300 reference build and GB300 NVL72 as proof of capability; defines competitive baseline as fab's own in-house team. |
| 02 | 我們交付什麼 / WHAT WE DELIVER | Six-layer stack L1–L6 with one-line scope per layer; each layer links to Solutions or Technology pages. Compliance badges at bottom. |
| 03 | 治理與責任 / GOVERNANCE & ACCOUNTABILITY | Four governance pillars: RACI每議題唯一A, 8道Gate把關, 風險三級升級(紅/黃/綠), DR季度演練. |
| 04 | 交付節奏 / DELIVERY RHYTHM | Four-phase timeline (建廠/裝機/試產/量產) with milestone gates and key deliverables per phase. |
| 05 | 為何信任我們 / LEADERSHIP & CREDENTIALS | Founder placeholder credentials (values TBD before launch); two methodology differentiator statements; two knowledge-archiving statements (one duplicate/variant). |
| 06 | 關鍵數字 / KEY FIGURES | Four stat blocks: GB300 AI Fabric, 四階段, ≤4hr DR RTO, 100%歸檔. |
| 07 | 為您的晶圓廠 / ENGAGE | Closing CTA with tagline restatement; two buttons + email. |

### Hard facts to preserve

**L1–L6 Architecture (exact content per layer):**
- **L1 輸入層 INPUT LAYER:** 8大工藝機台 · SECS-GEM / GEM300 · OPC UA廠務 · 傳感網絡
- **L2 數據層 DATA LAYER:** Historian時序歸檔 · NVMe Lakehouse · EDA高頻採集
- **L3 算力層 COMPUTE LAYER:** GB300 NVL72 AI Fabric · HGX B300推理 · 800Gb/s Fabric
- **L4 應用層 APPLICATION LAYER:** Agentic RAG / LLM · Digital Twin（Omniverse）· 高量產MES平台（FAB300）
- **L5 治理層 GOVERNANCE LAYER:** CCC中控台 · SOC 24×7 · OT入侵偵測與資產可視化 · 合規底座
- **L6 備援層 RESILIENCE LAYER:** 溫備援跨區域 · 異步複製 · SD-WAN雙ISP · RTO ≤ 4hr / RPO ≤ 15min

**SLA / KPI numbers:**
- RTO ≤ 4hr（關鍵系統復原時間；有季度實測演練）
- RPO ≤ 15min（異步複製）
- SLO ≥ 95%（量產期持續監控）
- 100% 歸檔（跨廠範本移交）

**Delivery phases (gate mapping):**
- 建廠期 M1–M6 · Gate 1–2：機房土建、供電、液冷基礎設施；消防安防；環境驗收
- 裝機期 M7–M15 · Gate 3–5：GB300 NVL72主交付、AI Fabric部署；高量產MES平台上線；OT安全就位
- 試產期 M16–M21 · Gate 6–7：高量產MES / AI聯調、良率爬坡；DR首輪演練
- 量產期 M22+ · Gate 8：全速量產；SLO ≥ 95%持續監控；DR季度演練固化

**Governance framework labels:**
- RACI責任矩陣：每議題唯一A（Accountable）
- 8道Gate：逐道提交驗收文件，確認後才進入下一階段
- 風險三級升級：紅/黃/綠；黃級48小時升級至項目委員會；紅級即時上報廠方決策者
- DR季度演練：RTO ≤ 4hr 有實測為憑，結果存檔並列入下季Review

**Compliance standards listed:**
- 等保2.0三級
- 密評
- IEC 62443
- SEMI E187
- ISA-95

**Key figures stat blocks:**
- GB300 AI Fabric (GB300 NVL72 + HGX B300推理節點)
- 四階段（建廠→裝機→試產→量產）
- ≤ 4hr DR RTO（RPO ≤ 15min · 溫備援跨區域）
- 100% 歸檔（交付完成後移交，可在每座新廠重複套用）

**Contact:**
- hello@shinylogic.tech

**HUD coordinates on page:** X:0010 Y:0180 / X:0030 Y:0650 / X:0050 Y:0820 / X:0005 Y:0650 / X:0009 Y:0990

### CTAs / interactive elements
- 預約諮詢（button, hero; repeated in section 07）
- 了解解決方案 →（text link, hero; repeated in section 07）
- 查看解決方案（link per L1 layer card）
- 查看技術（link per L2, L3 layer cards）
- 查看解決方案（link per L4, L5, L6 layer cards）
- 解決方案全覽 →
- 技術深入了解 →
- hello@shinylogic.tech（email link）

### Reusable data structures
- **L1–L6 Layer Stack:** 6-card vertical or horizontal stack, each with layer number, Chinese name, English label, and scope text. Recurs on Solutions and Technology pages.
- **Governance pillars:** 4-item grid (RACI / Gate / Risk / DR).
- **Phase timeline:** 4-column phase strip with gate tags and milestone bullets.
- **Key figures stat strip:** 4 stat blocks (icon/number/label/sub-label).

---

## Page 3 — Solutions 解決方案 (`solutions.html`)

### Page purpose
Present the 6-layer architecture as 6 distinct solution domains — each with a clear business problem, delivery scope, key specs, and contract SLA — and argue against in-house build.

### Section list (in order)

| # | Heading (繁中 + English label) | Summary |
|---|---|---|
| Hero | 解決方案 · 六層全棧 // SOLUTIONS OVERVIEW | Headline "每一層，解決一類問題。"; 4 summary stats; two CTAs. |
| SOL.02 | 六層架構，六個解決框架 / SOLUTION FRAMEWORK | Brief narrative intro for each of L1–L6 with problem statement and one-line scope. |
| SOL.03 | 六大解決方案，逐一深解 / SOLUTION BLOCKS | Six expandable/block cards, each: AI算力與儲存, 製造執行MES, 高速網絡Fabric, 資訊安全OT/IT, 異地備援DR, 企業整合. Pattern: 問題 → 交付範圍 → 關鍵規格. |
| SOL.04 | 成果與承諾 / OUTCOMES & SLA | Six KPI commitments with compliance footer and governance summary. |
| SOL.05 | 為何委外，而非自建？ / BUILD VS BUY | Three structural arguments against in-house build (talent scarcity, schedule risk, no lock-in). Resolution paragraph + CTA. |
| ENGAGE | 為您的晶圓廠交付並承擔 IT/OT+AI 全棧責任 | Closing CTA + email + link to methodology. |

### Hard facts to preserve

**Hero stats:**
- 六層架構堆疊：6
- 解決方案域：6
- 系統SLO：≥ 95%
- DR RTO：≤ 4hr

**L1–L6 solution framework (problem + scope per layer):**

- **L1 輸入層 INPUT:** 問題：異質機台協議分歧，訊號孤立。範圍：8大工藝機台 SECS-GEM/GEM300接入；OPC UA廠務；EAP設備自動化；邊緣預處理節點。
- **L2 數據層 DATA:** 問題：高頻設備波形數據量大、時序複雜，傳統資料庫無法支撐AI特徵工程與EDA分析。範圍：Historian時序歸檔；Lakehouse EDA高頻採集；NVMe數據湖；數據治理與存取控制。
- **L3 算力層 COMPUTE:** 問題：AI訓練與即時推理需要超算級算力。範圍：3×GB300 NVL72（液冷）AI Fabric；4×HGX B300邊緣推理；Quantum-X800 800Gb/s XDR全互聯；Spectrum-X SN5600東西向網。
- **L4 應用層 APPLICATION:** 問題：製程知識分散在人腦與Excel，決策閉環耗時且無法規模化。範圍：高量產MES平台（FAB300）MES核心；Agentic RAG/LLM自主推理；NVIDIA Omniverse Digital Twin；ECR/ECO工程變更管理。
- **L5 治理層 GOVERNANCE:** 問題：OT與IT網絡邊界模糊，合規多軌並行。範圍：CCC中控台全廠事件整合；SOC 24×7 SIEM/SOAR驅動；OT入侵偵測與資產可視化；IEC 62443/SEMI E187/等保2.0三級合規底座。
- **L6 備援層 RESILIENCE:** 問題：晶圓廠停機成本極高，業務連續性需要架構級保障。範圍：溫備援跨區域架構；異步複製與SD-WAN雙ISP；2×HGX B300關鍵推理備援；DR季度演練；RTO ≤ 4hr / RPO ≤ 15min。

**Solution block specs (SOL.03):**

*AI算力與儲存 / AI COMPUTE & STORAGE:*
- 3×GB300 NVL72整機櫃AI系統，液冷全套設計與施工
- 4×HGX B300推理節點，承擔邊緣決策與備援推理
- NVMe數據湖，覆蓋EDA高頻波形至訓練特徵全鏈路儲存
- 機房液冷基礎設施設計，依液冷規格規劃總供電
- Key specs: GB300 NVL72×3（液冷AI Fabric · Blackwell Ultra）; HGX B300×4（邊緣推理 · Blackwell Ultra）; 儲存 NVMe數據湖

*製造執行MES / MANUFACTURING EXECUTION:*
- 高量產MES平台（FAB300）完整授權與實施
- 7核心模組全部上線：Dispatching、Genealogy、APC R2R+FDC、Recipe/RMS、Scheduling/APS、SPC/YMS、EAP/SECS-GEM
- 8大工藝機台 SECS-GEM（GEM300）聯調與驗收
- ISA-95 L3至L4數據流設計與企業ERP接口
- Key specs: MES平台＝高量產MES平台（FAB300）; 產能驗證＝HVM高量產旗艦; 授權+實施＝完整License+7模組現場實施; 年維護＝依合約確認

*高速網絡Fabric / HIGH-SPEED NETWORK FABRIC:*
- Quantum-X800 InfiniBand 144-port 800Gb/s XDR交換矩陣，覆蓋AI Fabric東西向計算網
- Spectrum-X SN5600 800Gb/s乙太網絡，覆蓋生產網南北向與存儲網
- ConnectX-8 SuperNIC + LinkX高速電纜與光纖佈線
- SD-WAN雙ISP廣域鏈路設計（DR路徑冗餘）
- Key specs: Quantum-X800（InfiniBand 800Gb/s XDR · 144-port）; Spectrum-X（SN5600 800Gb/s生產網）; ConnectX-8（SuperNIC端點網卡）

*資訊安全OT/IT / SECURITY — OT & IT:*
- OT入侵偵測與資產可視化，資產盤點與行為基線，覆蓋全廠OT網段
- NGFW部署（OT/IT邊界防護）+ EDR端點防護 + IAM/PAM特權存取
- SIEM/SOAR平台整合，CCC中控台統一告警管理
- SOC 24×7服務（含OT事件響應SLA），對齊IEC 62443/SEMI E187/等保2.0三級
- Key specs: OT可視化（OT入侵偵測與資產可視化）; SOC（24×7 SIEM/SOAR驅動）; 合規底座（IEC 62443 · SEMI E187 · 等保2.0三級）

*異地備援DR / DISASTER RECOVERY:*
- 異地溫備援機房選址、網絡設計與基礎設施建置
- 2×HGX B300關鍵推理備援節點（確保AI決策在DR期間維持）
- 異步複製架構設計，涵蓋MES數據、Historian、Lakehouse
- SD-WAN雙ISP廣域鏈路冗餘；DR季度演練計劃與SLA文件
- Key specs: RTO ≤ 4hr（關鍵系統）; RPO ≤ 15min（異步複製）; 備援架構（溫備援跨區域 · SD-WAN雙ISP）; DR維運（依合約確認）

*企業整合 / ENTERPRISE INTEGRATION:*
- ISA-95 L3↔L4數據流架構設計與實施，對齊MES FAB300接口規範
- ERP/PLM雙向接口（工單、BOM、庫存、良率報表）
- AMHS/MCS自動物料搬運系統整合，LIMS實驗室信息管理接口
- FMCS廠務管控系統OPC UA接口，統一進入數據層
- Key specs: 標準架構（ISA-95 L3↔L4雙向）; 整合系統（ERP · PLM · AMHS/MCS · LIMS · FMCS）; 通訊協議（OPC UA · SECS-GEM · REST API）

**Outcomes & SLA (SOL.04):**
- DR.01: DR RTO ≤ 4hr（關鍵系統 · 溫備援跨區域）
- DR.02: DR RPO ≤ 15min（異步複製 · 數據損失上限）
- SLO.03: 系統SLO ≥ 95%（全系統可用性 · SOC 24×7監控）
- YLD.04: 良率目標 ≥ 90%（SPC/YMS閉環 · APC R2R+FDC）
- GOV.05: 8 Gate交付管控（四階段 · RACI唯一A · 三級升級）
- KNW.06: 100%模板歸檔（跨廠複製就緒 · 知識資產保全）
- 合規底座：等保2.0三級、密評、IEC 62443、SEMI E187、ISA-95
- Governance summary: 8道Gate對齊四階段建置 · RACI每議題唯一責任人（A）· 風險三級（紅/黃/綠）升級機制 · DR演練納入季度Review閉環 · 跨廠模板100%歸檔備查

**Build vs Buy (SOL.05) — three structural arguments:**
1. 人才根本招不到 / TALENT SCARCITY（全球性人才短缺）
2. 進度風險直接壓縮試產爬坡窗口 / SCHEDULE RISK（交期不確定性）
3. 沒有鎖定 — 模板100%歸您 / NO LOCK-IN · TEMPLATE YOURS（知識資產100%歸檔）

**Contact listed:**
- hello@shinylogic.tech（寄送詢問）

**HUD coordinates:** X:0200 Y:0600 / X:0310 Y:0600 / X:0500 Y:0900 / X:0500 Y:1200

### CTAs / interactive elements
- 探索解決方案（anchor link）
- 預約諮詢（button, hero)
- 查看FAB300方法論（text link）
- 寄送詢問 hello@shinylogic.tech（email link）
- 預約諮詢（closing CTA)
- Per solution block: section expand/reveal (implied by "SOLUTION BLOCKS" pattern)

### Reusable data structures
- **Solution block card:** Problem / Scope / Key specs tri-section pattern (×6). Includes a proportional "佔比" visual (donut/gauge).
- **6-KPI SLA grid:** DR RTO / DR RPO / 系統SLO / 良率 / Gate / 歸檔 — 2×3 or 3×2 stat grid.
- **L1–L6 framework summary:** Same layer stack as About, now with problem-first framing.

---

## Page 4 — Technology 技術 (`technology.html`)

### Page purpose
Engineering deep-dive into every technology component across all 6 layers: GPU hardware, network fabric, MES modules, data/AI platform, OT/IT security architecture, DR topology, and compliance standards.

### Section list (in order)

| # | Heading (繁中 + English label) | Summary |
|---|---|---|
| Hero | 工程技術深探 // ENGINEERING DEEP-DIVE 智能晶圓廠的技術底座 | Four hero stats + L1–L6 layer navigation strip. |
| 01 | Blackwell Ultra算力底座 / AI COMPUTE | Hardware config table: GB300 NVL72×3, HGX B300×4, networking, storage. Liquid-cooling note. |
| 02 | 高速網絡Fabric / NETWORK FABRIC | Three device-level deep dives: Quantum-X800, Spectrum-X SN5600, ConnectX-8 SuperNIC. Three summary stats. |
| 03 | 高量產MES平台（FAB300）/ MES · FAB300 | 7-module map; key facts table; EAP integration scope. |
| 04 | 數據與AI平台 / DATA & AI | Four platform components: Historian, Lakehouse EDA, Digital Twin, Agentic RAG. |
| 05 | 資訊安全OT/IT / SECURITY | OT domain / IT/OT boundary / IT domain three-zone architecture + compliance alignment. |
| 06 | 韌性與異地備援 / RESILIENCE · DR | Two KPI stats + DR architecture detail table. |
| 07 | 合規基準 / COMPLIANCE | Five standards with definitions + compliance summary statement. |
| CTA | 技術底座已就位 | CTA + link to methodology. |

### Hard facts to preserve

**Hero stats:**
- AI GPU COMPUTE（no specific number, label only）
- 4PB STORAGE
- ≤ 4hr RESILIENCE
- 7 FAB300 MODULES

**AI Compute hardware (01):**
- GB300 NVL72 × 3（液冷 / 柜）
- HGX B300 × 4（推理節點）
- Quantum-X800（InfiniBand 800Gb/s XDR）
- Spectrum-X（SN5600 800Gb/s）
- ConnectX-8（SuperNIC + LinkX）
- 儲存：NVMe數據湖
- Note: GB300 NVL72必須液冷，機房供電依液冷規格規劃。

**Network Fabric (02):**
- Quantum-X800 InfiniBand：144-port · 800Gb/s XDR · 東西向AI計算互聯 · 支撐高頻張量並行訓練與Digital Twin即時數據流
- Spectrum-X SN5600：800Gb/s · 乙太網路 · 南北向生產網與AI服務網 · 橋接OT生產段與AI應用層，對齊ISA-95 L3/L4分段
- ConnectX-8 SuperNIC：RDMA卸載降低CPU負擔 + LinkX光纖模組提供低損耗傳輸
- Summary stats: 800Gb/s東西向頻寬 / 144-port交換埠位 / ConnectX-8每GPU節點

**FAB300 MES 7 modules (03):**
1. Dispatching / WIP調度
2. Genealogy譜系追溯
3. APC · R2R + FDC
4. Recipe / RMS配方管理
5. Scheduling / APS排程
6. SPC / YMS良率
7. 設備整合EAP / SECS-GEM（GEM300）

- 定位：HVM旗艦MES龍頭
- 授權＋實施：依合約議定授權規模
- 年維護：依合約SLA
- EAP聯調：8工藝機台 SECS-GEM/GEM300

**Data & AI platform (04):**
- Historian時序歸檔：製程參數、設備狀態、廠務數據；支援SOC 2合規數據留存
- Lakehouse EDA：Delta Lake架構統一批次與串流；EDA高頻波形採集
- Digital Twin：NVIDIA Omniverse；即時3D產線數位映像；機台狀態、WIP流與製程配方即時同步；支援虛擬除錯與排程模擬
- Agentic RAG：LLM推理核心；接收製程異常訊號後自主查閱知識庫、推理根因並閉環回饋配方

**Security architecture (05):**
- OT域：OT入侵偵測與資產可視化（IDS）; SECS-GEM/OPC UA監控; 設備固件完整性驗證
- IT/OT邊界：NGFW下一代防火牆; ISA-95 L3/L4分段; VLAN隔離; 加密傳輸TLS 1.3
- IT域：SIEM/SOAR; SOC 24×7; EDR/IAM/PAM; 威脅情報訂閱
- Compliance: IEC 62443, SEMI E187, ISA-95, 等保2.0三級, 密評

**DR architecture (06):**
- RTO ≤ 4hr（關鍵系統復原時間目標）
- RPO ≤ 15min（數據復原點目標）
- 拓撲：溫備援（Warm Standby）跨區域
- 複製：異步複製 · 關鍵DB延遲 ≤ 15min
- 廣域鏈路：SD-WAN雙ISP · 自動切換
- DR算力：2×HGX B300關鍵推理保留
- DR維運：依合約DR SLA
- 演練：DR演練納入季度Review

**Compliance standards with definitions (07):**
- IEC 62443：工業自動化與控制系統安全；OT域安全架構主要參考標準；定義分區（Zone）、管道（Conduit）與安全等級（SL）
- SEMI E187：半導體工廠網路安全規範；SEMI針對晶圓廠設備與網路的專項安全規範；覆蓋SECS-GEM通訊安全要求
- ISA-95：企業控制系統整合標準；L3↔L4整合架構依據；確保MES與ERP/PLM的資訊交換模型一致
- 等保2.0三級：中國網路安全等級保護2.0三級認證；適用於關鍵資訊基礎設施的安全要求
- 密評：商用密碼應用評估；商用密碼算法（SM2/SM3/SM4）應用安全評估；適用於具有密碼合規要求的場景
- Summary statement: 所有架構層均對齊以上五項標準；合規文件於8道Gate逐階驗證

**HUD coordinates:** X:0520 Y:AI01 / X:0610 Y:MES / X:1200 Y:0700

### CTAs / interactive elements
- L1–L6 navigation strip (scrollable layer selector in hero)
- 預約諮詢（button, CTA section）
- 查看方法論深探 →（text link）

### Reusable data structures
- **Hardware config table:** Device name / spec string / note — used for AI Compute section.
- **FAB300 module map:** 7-item numbered list with Chinese + English module names.
- **Security zone diagram:** Three-zone vertical split (OT域 / IT/OT邊界 / IT域) with component lists.
- **DR architecture table:** Attribute / value rows (拓撲 / 複製 / 廣域鏈路 / DR算力 / DR維運 / 演練).
- **Compliance matrix:** 5-row table (standard / full name / definition / domain).

---

## Page 5 — Methodology 方法論 (`case-studies.html`)

### Page purpose
Present the FAB300 Reference Methodology as a complete, reproducible delivery system: scope matrix across 6 capability categories × 4 phases, timeline with gates, SLA outcomes, 6-domain risk register, and cross-fab replication blueprint.

### Section list (in order)

| # | Heading (繁中 + English label) | Summary |
|---|---|---|
| Hero | FAB300 REFERENCE METHODOLOGY 智能晶圓廠IT/OT+AI整合參考方法論 | Four hero stats + methodology scope summary (4 bullets). |
| FIG.02 | 六層×階段交付矩陣 / DELIVERY SCOPE MATRIX | 10-row × 4-phase delivery matrix with key deliverable per cell; gate labels per column header. |
| FIG.03 | 四階段交付 / DELIVERY TIMELINE | Phase strip P1–P4 with gate, milestone name, and deliverable summary per phase. |
| FIG.04 | 成果與承諾 / OUTCOMES & SLA | Five KPI commitments + compliance footer (same 5 standards). |
| FIG.05 | 風險與合規 / RISK & COMPLIANCE | Six risk domains (R.01–R.06), each with risk description and mitigation action. |
| FIG.06 | 跨廠複製藍圖 / CROSS-FAB REPLICATION | 3-step replication process + 5-item template content checklist + honest disclaimer. |
| ENGAGE | 規劃您的智能晶圓廠 | Closing CTA. |

### Hard facts to preserve

**Hero stats:**
- 端到端交付：IT/OT+AI全棧整合
- NVIDIA算力：GB300 NVL72 + HGX B300算力底座
- DR RTO ≤ 4hr · RPO ≤ 15min
- 系統SLO ≥ 95%

**Methodology scope bullets:**
- MES核心：高量產MES平台（FAB300）— 實證高量產HVM旗艦
- AI算力：GB300 NVL72 AI Fabric + HGX B300推理節點，端到端AI算力底座
- 六層架構：輸入 · 數據 · 算力 · 應用 · 治理 · 備援，端到端全覆蓋
- 業務連續性：異地備援DR、SD-WAN雙ISP；RTO ≤ 4hr、RPO ≤ 15min

**Delivery scope matrix — rows (capability categories) × columns (phases):**

| 類別 | P1建廠期 M1–M6 Gate 1–2 | P2裝機期 M7–M15 Gate 3–5 | P3試產期 M16–M21 Gate 6–7 | P4量產期 M22+ Gate 8 |
|---|---|---|---|---|
| AI算力與儲存 | 機房液冷規劃 | GB300主交付 | AI Fabric聯調 | 持續優化 |
| 平台軟體（MES+AI）| 授權規劃 | MES上線 | 模型訓練 | SLO監控 |
| 高速網絡Fabric | 基礎網絡鋪設 | AI Fabric部署 | 全連通驗收 | 持續維運 |
| 異地備援DR | 選址規劃 | 備援建置 | 首輪演練 | 季度演練 |
| 資訊安全OT/IT | 合規底座設計 | OT安全整合 | SOC上線 | SOC 24×7 |
| 機房 · 液冷 · 供電 | 土建施工 | 液冷投產 | 環境驗收 | 常態維護 |
| 中控台與視覺化 | 架構設計 | CCC部署 | Digital Twin上線 | 持續監控 |
| 企業整合 | 接口定義 | ERP/PLM對接 | ISA-95驗收 | 持續維護 |
| 消防安防與備件 | 消防佈設 | 安防整合 | 備件入庫 | 常態維護 |
| 員工設備 | 先鋒裝備 | 主力裝備 | 試產配置 | 量產完備 |

Note: 依六層架構對齊 · 交付範疇依合約確認

**Delivery timeline phases (FIG.03):**
- PHASE 01 建廠期 M1–M6 Gate 1–2：廠房改建、液冷機房、供電系統、基礎網絡鋪設
- PHASE 02 裝機期 M7–M15 Gate 3–5：GB300 NVL72交付與上架、AI Fabric建設、MES部署、OT安全整合
- PHASE 03 試產期 M16–M21 Gate 6–7：系統聯調、AI模型訓練、DR首輪演練、良率爬坡驗收
- PHASE 04 量產期 M22+ Gate 8：全速量產、SOC 24×7接管、持續優化與跨廠範本歸檔
- Note: 維運自裝機期起算；DR於試產期完成首輪演練

**Outcomes & SLA (FIG.04):**
- YLD.01: 良率目標 ≥ 90%（AI輔助製程調控，SPC/YMS即時回饋，量產爬坡期即介入）
- SLO.02: 系統SLO ≥ 95%（全棧六層系統可用率承諾，SOC 24×7監控保障，覆蓋MES及AI Fabric）
- DR.03: DR RTO ≤ 4hr（關鍵系統恢復時間目標；溫備援架構+SD-WAN雙ISP冗餘保障）
- DR.04: DR RPO ≤ 15min（資料復原點目標；異步複製確保生產數據損失不超過15分鐘）
- TPL.05: 跨廠模板歸檔 100%（量產期結束後，全套建置設定、流程與AI模型完整歸檔為跨廠複製範本）
- 合規底座：等保2.0三級, 密評, IEC 62443, SEMI E187, ISA-95, SOC 24×7

**Risk register (FIG.05):**
- R.01 供應鏈風險 / SUPPLY CHAIN：GB300 NVL72為新世代高需求產品，需提前12個月鎖單並設備用方案。對策：鎖單+備份方案（HGX B300擴容）
- R.02 匯率風險 / FX RISK：高階設備多以美元計價。對策：遠期合約鎖匯 · 彈性採購緩衝
- R.03 合規風險 / COMPLIANCE：等保2.0三級、IEC 62443 Zone/Conduit、SEMI E187 OT網路安全。對策：合規底座於裝機期第一階段Gate完成驗收
- R.04 交期風險 / SCHEDULE：液冷機房施工、特種電氣改造工期依賴地方審批。對策：M1啟動審批，並行施工+週進度里程碑
- R.05 系統整合風險 / INTEGRATION：六層架構跨越OT/IT邊界，SECS-GEM/GEM300聯調涉及8類機台廠商。對策：接口凍結於建廠期Gate 2，EAP聯調M5啟動
- R.06 人力風險 / STAFFING：Blackwell Ultra世代稀缺工程師需提早佈局。對策：關鍵崗位留任計畫+知識文件化

**Cross-fab replication (FIG.06):**
- Three steps: 01範本歸檔 → 02差異評估 → 03快速部署
- 第二廠預計裝機期縮短20–30%，試產期聯調週期縮短15–25%（視差異度而定）
- Honest disclaimer: 範本降低複製成本，但不等於零定制工作。每廠的機台廠商、製程節點與廠房條件不同，需經差異評估後方能確認定制範圍與工期。
- Template content checklist (all marked 歸檔):
  1. 六層架構設計文件與BOM
  2. MES FAB300設定基線（7模組）
  3. AI模型基線（良率/DR預測）
  4. OT安全Zone/Conduit策略
  5. DR演練腳本與驗收標準

**HUD coordinates:** X:0600 Y:FAB300 TEMPLATE REV.01 / X:0435 Y:4300

### CTAs / interactive elements
- 預約諮詢（button, hero and closing）
- 預約範疇討論（button variant, closing）

### Reusable data structures
- **Delivery scope matrix:** 10-row × 4-column matrix (largest grid on site; becomes a complex table/kanban component).
- **Phase timeline strip:** Same 4-phase layout as About but with expanded deliverable bullets.
- **5-KPI SLA cards:** Same pattern as Solutions SOL.04.
- **Risk domain cards:** 6-card grid with risk label / description / 對策.
- **Replication step strip:** 3-step numbered process.
- **Template checklist:** 5-item checklist with status badge (歸檔).

---

## Page 6 — Careers 招募 (`careers.html`)

### Page purpose
Recruit engineers to the IT 智能部; present 8 functional teams, 4-phase hiring cadence, culture values, and 6 representative open roles.

### Section list (in order)

| # | Heading (繁中 + English label) | Summary |
|---|---|---|
| Hero | 招募 · IT智能部 // JOIN THE BUILD | Headline + 3 hero stats (IT智能部 / 4階段組建 / 8功能團隊); two CTAs. |
| 01 | 前沿技術，真實場景 / WHY SHINYLOGIC | Four technology-domain cards showing what engineers work on (GB300, FAB300, Digital Twin, OT安全). |
| 02 | IT智能部，八大職能 / TEAM FUNCTIONS | T1–T8 function cards each with name, English label, one-line responsibility, and 3 technology tags. |
| 03 | 四階段組建，逐步到位 / HIRING RHYTHM | P1–P4 staffing phases with milestone labels and function tags. |
| 04 | 拿授權，拿責任 / CULTURE & VALUES | 3 operating principles + 5 operating norm stats. |
| 05 | 代表性職缺 / OPEN ROLES | JD-001 to JD-006 role cards. |
| APPLY | 投遞履歷 / APPLY | Direct email instruction + two CTAs. |

### Hard facts to preserve

**Hero stats:**
- IT智能部
- 4階段組建
- 8功能團隊
- TEAMS: 8 · PHASES: 4 · STATUS [ ACTIVE ]

**8 team functions (T1–T8):**
- T1 架構治理 / ARCHITECTURE & GOVERNANCE：制定IT/OT六層技術堆疊藍圖、標準與Gate審查流程；RACI管理與跨廠知識模板歸檔。Tags: 企業架構 / RACI / Gate Review
- T2 MES/EAP / MANUFACTURING EXECUTION：高量產MES平台（FAB300）實施、SECS-GEM/GEM300機台聯調、WIP調度優化與APC R2R+FDC閉環。Tags: FAB300 / SECS-GEM / APC FDC
- T3 AI/MLOps / AI & MLOPS：模型訓練與部署平台（基於GB300 AI Fabric）、Agentic RAG開發、Digital Twin算力供給與MLOps流水線。Tags: GB300 NVL72 / Agentic RAG / Omniverse
- T4 網絡 / NETWORK FABRIC：Quantum-X800 InfiniBand 800Gb/s AI Fabric、Spectrum-X東西向交換及南北向生產網設計與維運。Tags: Quantum-X800 / Spectrum-X / OT網段
- T5 資安/SOC / SECURITY & SOC：OT入侵偵測與資產可視化、SOC 24×7 SIEM/SOAR運營、NGFW/EDR/IAM/PAM，對齊IEC 62443與等保2.0三級。Tags: IEC 62443 / SIEM/SOAR / 等保2.0
- T6 DR業務連續性 / DISASTER RECOVERY：溫備援跨區域架構、異步複製、SD-WAN雙ISP；保障RTO ≤ 4hr/RPO ≤ 15min，DR演練納入季度Review。Tags: RTO ≤ 4hr / RPO ≤ 15min / SD-WAN
- T7 企業整合 / ENTERPRISE INTEGRATION：打通ISA-95 L3↔L4數據流：ERP/PLM接口、AMHS/MCS、LIMS、FMCS；確保跨系統數據完整性。Tags: ISA-95 / ERP/PLM / AMHS/MCS
- T8 中控CCC / CENTRAL COMMAND & CONTROL：整合全廠事件告警、KPI看板、異常升級與跨部門協調；CCC中控台是全廠可觀測性的單一入口。Tags: CCC中控台 / 全廠告警 / KPI看板

**Hiring rhythm phases:**
- P1建廠期 M1–M6：先鋒編組；核心架構師與MES/網絡先鋒，制定技術藍圖，完成機房選址與基礎設施規劃。Tags: 架構治理 / 基建規劃
- P2裝機期 M7–M15：主力編組；GB300 NVL72主交付、AI Fabric建置、MES上線；網絡、資安、MLOps團隊主力加入。Tags: GB300 AI Fabric / MES / 資安SOC
- P3試產期 M16–M21：全員編組；DR首輪演練、Digital Twin上線、良率優化閉環啟動；AI/MLOps與CCC中控全員到位。Tags: DR演練 / Digital Twin / 良率優化
- P4量產期 M22+：常態編組；全員就位，持續維運與優化；SLO ≥ 95%、良率 ≥ 90%承諾生效，跨廠模板100%歸檔。Tags: SLO ≥ 95% / 持續優化 / 跨廠複製

**Culture & Values (3 principles):**
- PRINCIPLE 01 授權不是口號：每個技術決策都有且只有一個A（Accountable Owner）。以合約Gate確認，不以層級審批代替。
- PRINCIPLE 02 責任由架構承諾：SLO ≥ 95%、RTO ≤ 4hr、良率 ≥ 90%寫入合約。
- PRINCIPLE 03 數字說話，風險透明：三級風險升級（紅/黃/綠），DR季度演練，跨廠模板100%歸檔。

**Operating norms (5 stats):**
- 8 Gate：四階段Gate審查，逐道把關推進
- 1 A/議題：RACI每議題唯一Accountable Owner
- 3級：風險升級（紅/黃/綠）透明化
- 季度：DR演練，納入季度Review閉環
- 100%：跨廠模板知識歸檔，無知識孤島
- Compliance: 等保2.0三級, IEC 62443, SEMI E187, ISA-95, 密評

**Open roles (JD-001 to JD-006):**

| ID | Function | Title | Level | Priority Phase |
|---|---|---|---|---|
| JD-001 | 架構治理 | IT/OT解決方案架構師 / IT/OT SOLUTION ARCHITECT | 高級/Staff | 裝機期優先 |
| JD-002 | MES/EAP | MES資深工程師（FAB300）/ SR. MES ENGINEER — FAB300 | 中高級 | 裝機期優先 |
| JD-003 | AI/MLOps | AI/MLOps工程師（GPU叢集）/ AI/MLOPS ENGINEER — GPU CLUSTER | 中高級/Senior | 裝機期—試產期 |
| JD-004 | 資安/SOC | OT資安工程師/SOC分析師 / OT SECURITY ENGINEER / SOC ANALYST | 中級/Mid | 裝機期優先 |
| JD-005 | 網絡 | 網絡工程師（InfiniBand/OT）/ NETWORK ENGINEER — INFINIBAND & OT | 中高級 | 建廠—裝機期 |
| JD-006 | DR/企業整合 | DR/業務連續性工程師 / DR & BUSINESS CONTINUITY ENGINEER | 中高級 | 試產期優先 |

- Open-ended note: 未見到您的專業？我們對所有具備晶圓廠IT/OT背景的工程師開放 — 歡迎主動聯絡。
- Application method: 履歷直接發送至 hello@shinylogic.tech（無填表、無ATS迷宮 — 直接聯繫負責人）

**HUD coordinates:** X:IT01 Y:0008 / X:IT01 Y:FAB3

### CTAs / interactive elements
- 立即投遞履歷（button, hero）
- 查看代表性職缺（anchor link, hero）
- 投遞履歷（button, repeated per JD card × 6）
- hello@shinylogic.tech（email link in APPLY section）
- 聯絡我們（button in APPLY section）

### Reusable data structures
- **Team function cards:** 8-item grid, each with T-number, Chinese name, English label, description, 3 tech tags.
- **Hiring phase strip:** Same 4-phase pattern as About/Methodology, recontextualized for staffing.
- **Job listing cards:** 6-item list with JD number / function / title / description / phase priority / level / CTA.
- **Operating norms stat strip:** 5-item row (same 5-stat pattern as Solutions SOL.04, different data).

---

## Page 7 — Contact 預約諮詢 (`contact.html`)

### Page purpose
Primary conversion page: 4-step engagement process overview, inquiry form (5 inquiry types), direct contact details, location, and inquiry type guide.

### Section list (in order)

| # | Heading (繁中 + English label) | Summary |
|---|---|---|
| Hero | 09 · ENGAGE 規劃您的智能晶圓廠 | Location coordinate display; one-sentence purpose statement. |
| ENGAGE.00 | 四步交付流程 / FOUR-STEP PROCESS | Steps 01–04: 諮詢評估 → 範圍評估 → 建置合約 → 交付+100%歸檔; brief delivery responsibility statement. |
| FORM.01 | 諮詢表單 / INQUIRY FORM | 5-field form with submission info and error/success states. |
| DIRECT.02 | 直接聯絡 / DIRECT CONTACT | Email, response time, service languages, coordinates, location. |
| INFO.03 | 諮詢類型說明 / INQUIRY TYPES | 5 inquiry types with target audience per type. |
| CTA | 規劃您的智能晶圓廠 | 3 stat badges + 2 CTAs + coordinate display. |

### Hard facts to preserve

**Location:**
- N 24°08′ E 120°41′
- TAIWAN · HSINCHU（臺灣 · 新竹科學工業園區附近）
- Label: [ ACTIVE ]

**Contact details:**
- Email: hello@shinylogic.tech
- 回覆時效：2個工作天以內
- 服務語言：繁體中文 · 英文 · 简体中文
- 座標：N 24°08′ E 120°41′

**4-step process:**
1. 諮詢評估 / CONSULTATION：一通對談，釐清您的晶圓廠建置需求、IT/OT現況與希望我們承擔的全棧範圍。
2. 範圍評估 / SCOPE ASSESSMENT：白紙黑字界定L1–L6交付範圍、SLA指標與驗收標準，簽約前雙方對齊，無灰色地帶。
3. 建置合約 / DELIVERY CONTRACT：與您的晶圓廠直接簽訂建置合約，明確商務條款、Gate里程碑與付款計畫。
4. 交付+100%歸檔 / DELIVER + ARCHIVE：依8道Gate交付全棧整合層，通過SLA驗收，並交還100%歸檔的跨廠範本供您未來擴廠重複套用。

Delivery responsibility note: 競爭基準是貴廠的內部自建團隊 — 我們提供的是外包給專業全棧團隊的替代選項。

**Inquiry form fields:**
- 姓名（required *）
- 公司（optional）
- 電子郵件（required *）
- 諮詢類型（required *; dropdown）
- 訊息（required *）
- Data handling: 送出後，您的諮詢內容會傳送並保存至本公司的Google工作表，僅用於回覆此次諮詢。
- Hidden field: Website（honeypot, implied)
- Error state: 送出失敗，請稍後再試，或透過本頁的電子郵件直接與我們聯繫。
- Success state: 諮詢已送出 — 感謝您的訊息。我們將於兩個工作天內與您聯繫。

**5 inquiry types:**
1. 建置規劃 / BUILD PLANNING：針對新建或擴建晶圓廠的IT/OT+AI全棧建置規劃。適合：新建廠、擴建廠、IT/OT現代化升級
2. 技術諮詢 / TECHNICAL ADVISORY：針對AI算力（GB300/HGX B300）、MES（FAB300）、OT安全（IEC 62443）或DR架構的深度技術評估。適合：架構評估、技術選型、POC規劃
3. 供應商協調 / VENDOR COORDINATION：晶圓廠建置中的供應商與技術選型協調。適合：晶圓廠建置中的供應商與技術選型協調
4. 招募 / CAREERS：加入四階段建設團隊。適合：工程師、顧問、專案管理
5. 媒體 / MEDIA：媒體採訪、行業報告、白皮書合作或活動邀請，請提供媒體機構名稱與截稿日期。適合：記者、分析師、研究機構

**CTA section stats:**
- 全棧交付 IT/OT+AI整合
- DR RTO ≤ 4hr
- 系統SLO ≥ 95%

**HUD coordinates:** X:0901 Y:FORM / X:0903 Y:TYPE / N 24°08′ E 120°41′ · TAIWAN

### CTAs / interactive elements
- 送出諮詢 →（form submit button）
- 預約諮詢（CTA section button）
- 查看交付流程（text link, CTA section）
- Inquiry type dropdown (5 options)

### Reusable data structures
- **4-step process flow:** Numbered steps 01–04 with arrow connectors; similar to Methodology timeline structure.
- **Inquiry type cards:** 5-item grid with type name / English label / description / 適合 tag.
- **Contact info block:** Email / response time / languages / coordinates — a compact info card.

---

## Cross-cutting Elements

### Global navigation
Primary nav items (identical across all pages):
- 關於
- 解決方案
- 技術
- 方法論
- 招募
- **預約諮詢**（CTA button, visually distinct)

Secondary nav is duplicated (mobile/desktop copies visible in corpus): both nav blocks contain the same 6 items including 繁/EN/简 toggle.

### Trilingual language toggle
- 繁（Traditional Chinese — default）
- EN（English）
- 简（Simplified Chinese）
Appears in header nav on every page and in footer under 語言 / LANGUAGE.

### Footer content (identical across all pages)

**Brand line:**
SHINYLOGIC 顯藝科技
We build the intelligence layer of the modern wafer fab. 把設備數據，鍛造成可決策的智能。

**Footer nav columns:**
- 公司：關於 / 招募
- 能力：解決方案 / 技術 / 方法論
- 聯絡：hello@shinylogic.tech

**Language selector in footer:**
語言 / LANGUAGE：繁 / EN / 简

**Legal / disclaimer:**
- 交付範疇依合約確認
- © 2026 顯藝科技 ShinyLogic. All rights reserved.

**Footer tagline ticker (scrolling):**
FAB300 REFERENCE BUILD · IT/OT+AI 全棧整合 · 直接交付晶圓廠 · 100% 歸檔

### Brand lockup
- Primary name: SHINYLOGIC 顯藝科技
- Product / Reference Build label: FAB300
- Sub-headline (in nav header): INTELLIGENT WAFER FAB SYSTEMS
- Sub-headline (line 2): IT/OT+AI 全棧交付 / IT/OT+AI Full-Stack Delivery

### Primary tagline
> 把設備數據，鍛造成可決策的智能。

Appears verbatim: About page hero, About section 01, Solutions page ENGAGE, Technology page footer, Methodology page footer, Careers page footer, Contact page footer.
English equivalent (footer only): "We build the intelligence layer of the modern wafer fab."

### Recurring HUD / coordinate motif
Every page section features a monospaced coordinate string in the format `X:NNNN Y:NNNN` or `N DD°MM′ E DDD°DD′`, rendered as ambient technical decoration (implies sensor/fab-floor HUD aesthetic). Coordinates vary by section, not by page. Notable fixed coordinate: **N 24°08′ E 120°41′** (Contact page — actual Hsinchu Science Park location).

Sample HUD strings across site:
- X:0010 Y:0180 / X:0030 Y:0650 / X:0005 Y:0650 / X:0009 Y:0990 (About)
- X:0200 Y:0600 / X:0310 Y:0600 / X:0500 Y:0900 (Solutions)
- X:0520 Y:AI01 / X:0610 Y:MES / X:1200 Y:0700 (Technology)
- X:0600 Y:FAB300 TEMPLATE REV.01 / X:0435 Y:4300 (Methodology)
- X:IT01 Y:0008 / X:IT01 Y:FAB3 (Careers)
- X:0901 Y:FORM / X:0903 Y:TYPE (Contact)

### Recurring section number convention
Sections are numbered with double-digit prefix comment strings (// 01, // 02, etc.) and some sections display large numerals (01, 02, 03…) as decorative typographic elements. These appear to be typographic accent numbers, not navigation anchors.

### Universal compliance badge set
Five compliance standards appear together as a badge cluster on: About (section 02), Solutions (SOL.04), Technology (section 07), Methodology (FIG.04, FIG.05), Careers (section 04):
- 等保2.0三級
- 密評
- IEC 62443
- SEMI E187
- ISA-95

### Universal SLA commitment set
Six KPI values appear together repeatedly across Solutions (SOL.04), Methodology (FIG.04), and Careers (section 04):
- DR RTO ≤ 4hr
- DR RPO ≤ 15min
- 系統SLO ≥ 95%
- 良率 ≥ 90%
- 8 Gate交付管控
- 100% 模板歸檔

### Delivery responsibility boilerplate
The following sentence (or close variants) appears as a closing/CTA paragraph on every page:
> 顯藝科技直接為您的晶圓廠交付並承擔IT/OT+AI全棧的建置、整合與維運責任，並交還100%歸檔的跨廠範本。

### Copyright year
© 2026（site copyright is 2026, not 2025）

---

*End of content inventory. Total pages cataloged: 6 of 7 (Home/index absent from corpus). All Chinese text preserved verbatim where it constitutes a fact, claim, product name, or heading.*
