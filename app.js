/* ===================================================
   EDI ADJUDICATION TOOL — app.js
   Euro-Center · All views + interactions
   =================================================== */

// --- Icons ----------------------------------------
const ICONS = {
    sort:    `<svg class="sort-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
    search:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    export:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    plus:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    chevL:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
    chevR:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
    pin:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    mail:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    edit:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    trash:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.67"/></svg>`,
    arrow:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
};

// --- Helpers --------------------------------------
function daysBadge(n) {
    const cls = n <= 5 ? 'fresh' : n <= 20 ? 'caution' : n <= 60 ? 'warn' : 'urgent';
    return `<span class="days-badge ${cls}">${n}</span>`;
}

function usd(val) {
    const n = parseFloat(String(val).replace(',', '.'));
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function perPage(active = 20) {
    return `<div class="per-page-group">
        <button class="per-page-btn${active===10?' active':''}">10</button>
        <button class="per-page-btn${active===20?' active':''}">20</button>
        <button class="per-page-btn${active===50?' active':''}">50</button>
    </div>`;
}

function searchBar(placeholder, extra = '') {
    return `<div class="filter-bar">
        <div class="search-input-wrap">
            ${ICONS.search}
            <input class="input" type="text" placeholder="${placeholder}">
        </div>
        ${extra}
    </div>`;
}

function tableFooter(total, shown = 20) {
    return `<div class="table-footer">
        <span class="table-count">Showing 1–${Math.min(shown,total)} of <strong>${total}</strong> records</span>
        <div class="pagination">
            <button class="page-btn" disabled>${ICONS.chevL}</button>
            <button class="page-btn active">1</button>
            <button class="page-btn">2</button>
            <button class="page-btn">3</button>
            <button class="page-btn">${ICONS.chevR}</button>
        </div>
    </div>`;
}

// Sort-icon TH helper
function th(label, sortable = true) {
    return `<th>${label}${sortable ? ' '+ICONS.sort : ''}</th>`;
}

// ===================================================
//  SAMPLE DATA  (exact from reference screenshots)
//  Policy Holder Name repopulated with Nordic names
// ===================================================

// Client → name map (consistent across all views)
const NAME_MAP = {
    '1262311': 'E. LINDQVIST',   '1168331': 'A. BJÖRK',
    '1247589': 'S. ERIKSSON',    '706093' : 'M. ANDERSEN',
    '1274223': 'K. HALVORSEN',   '1322220': 'L. MAGNUSSON',
    '1190166': 'I. SVENSSON',    '1207456': 'H. JOHANSSON',
    '930201' : 'R. LARSEN',      '1315169': 'F. BERGSTRÖM',
    '360973' : 'C. KRISTIANSEN', '1045425': 'P. HOLM',
    '971895' : 'B. DAHL',        '1319084': 'V. STRAND',
    '1085931': 'N. HAUGEN',      '1040080': 'O. LUND',
    '1089330': 'G. THORSEN',     '1086833': 'U. JANSSON',
    '1103320': 'W. MÄKINEN',     '1045155': 'T. NIELSEN',
    '1110621': 'H. JOHANSSON',   '1113888': 'S. ERIKSSON',
    '1119004': 'M. ANDERSEN',    '770911' : 'K. HALVORSEN',
    '1274745': 'L. MAGNUSSON',   '1291486': 'I. SVENSSON',
    '1289576': 'R. LARSEN',      '1290686': 'F. BERGSTRÖM',
    '1253819': 'C. KRISTIANSEN', '1281770': 'P. HOLM',
};
function name(clientId) { return NAME_MAP[clientId] || 'N. HAUGEN'; }

function taskCreationCell(org) {
    const prefix = org.split('-')[0];
    const interactive = ['007', '008', '018'].includes(prefix);
    if (interactive) {
        return `<td><div class="task-cb-wrap"><input class="task-cb" type="checkbox"></div></td>`;
    }
    return `<td><div class="task-cb-wrap"><input class="task-cb" type="checkbox" checked disabled></div></td>`;
}

const MISSING_CLAIMS = [
    { days:0, uhap:'15738749', error:'Diagnosis code mismatch',            client:'1262311', org:'007-001', date:'2025-09-12', diag:'S8992XA', unit:'2907,00',  payable:'2127,92' },
    { days:0, uhap:'15738759', error:'Diagnosis code mismatch',            client:'1168331', org:'143-001', date:'2026-03-04', diag:'R509',    unit:'5605,00',  payable:'946,80'  },
    { days:0, uhap:'15742576', error:'Diagnosis code mismatch',            client:'1247589', org:'008-005', date:'2026-03-03', diag:'Z0000',   unit:'5560,00',  payable:'2244,57' },
    { days:0, uhap:'15740163', error:'Diagnosis code mismatch',            client:'706093',  org:'008-005', date:'2026-03-03', diag:'E109',    unit:'2256,47',  payable:'1184,16' },
    { days:0, uhap:'15742575', error:'Diagnosis code mismatch',            client:'1247589', org:'008-005', date:'2026-03-02', diag:'Z1231',   unit:'939,00',   payable:'499,55'  },
    { days:0, uhap:'15741448', error:'Diagnosis code mismatch',            client:'1274223', org:'190-001', date:'2026-02-12', diag:'M1711',   unit:'111,00',   payable:'50,36'   },
    { days:0, uhap:'15741166', error:'Wrong claim provided',               client:'1322220', org:'190-001', date:'2026-03-04', diag:'J310',    unit:'300,00',   payable:'256,54'  },
    { days:0, uhap:'15742970', error:'Treatment outside of policy period', client:'1190166', org:'007-001', date:'2026-02-26', diag:'J4520',   unit:'367,00',   payable:'298,08'  },
    { days:0, uhap:'15746709', error:'Diagnosis code mismatch',            client:'1247589', org:'008-005', date:'2026-03-05', diag:'F411',    unit:'895,00',   payable:'411,57'  },
    { days:0, uhap:'15746039', error:'Diagnosis code mismatch',            client:'1168331', org:'143-001', date:'2026-03-04', diag:'R509',    unit:'550,00',   payable:'410,16'  },
];

const MISSING_GOP = [
    { days:57, uhap:'15555658', error:'Cannot find GOP with proper provider tax id',  client:'1207456', org:'100-001', date:'2025-05-02', diag:'I4891',  unit:'960,00',   provTax:'650691863',  payable:'960,00',   claim:'1687397', comment:'TFR - Awaiting ECA create a GOP line'  },
    { days:54, uhap:'15571536', error:'Cannot find GOP with status: Pending',         client:'930201',  org:'143-001', date:'2024-12-12', diag:'Z9484',  unit:'440,00',   provTax:'133278575',  payable:'172,00',   claim:'1582949', comment:'TFR - Awaiting ECA create a GOP line'  },
    { days:35, uhap:'15635620', error:'Cannot find GOP with proper provider tax id',  client:'1207456', org:'100-001', date:'2025-04-16', diag:'R52',    unit:'885,00',   provTax:'596000573',  payable:'885,00',   claim:'1687397', comment:'LBE - awaiting ECA create a GOP line'  },
    { days:23, uhap:'15653521', error:'Cannot find GOP with proper provider tax id',  client:'1315169', org:'081-001', date:'2026-02-06', diag:'J020',   unit:'427,53',   provTax:'411939629',  payable:'128,97',   claim:'1839200', comment:''                                      },
    { days:23, uhap:'15656388', error:'Cannot find GOP with proper provider tax id',  client:'360973',  org:'143-001', date:'2025-12-31', diag:'D68311', unit:'285,00',   provTax:'650825133',  payable:'218,12',   claim:'1735205', comment:'LBE - Awaiting ECA create a GOP line'  },
    { days:23, uhap:'15656387', error:'Cannot find GOP with proper provider tax id',  client:'360973',  org:'143-001', date:'2025-12-29', diag:'D68311', unit:'285,00',   provTax:'650825133',  payable:'218,12',   claim:'1735205', comment:'LBE - Awaiting ECA create a GOP line'  },
    { days:22, uhap:'15671541', error:'Cannot find GOP with proper provider tax id',  client:'360973',  org:'143-001', date:'2025-12-30', diag:'D66',    unit:'200,00',   provTax:'650026153',  payable:'41,86',    claim:'1735205', comment:'LBE - Awaiting ECA create a GOP line'  },
    { days:21, uhap:'15682360', error:'Cannot find GOP with proper provider tax id',  client:'360973',  org:'143-001', date:'2025-12-26', diag:'D68311', unit:'377,00',   provTax:'650825133',  payable:'291,44',   claim:'1735205', comment:'LBE - Awaiting ECA create a GOP line'  },
    { days:1,  uhap:'15739193', error:'Cannot find GOP with proper provider tax id',  client:'1045425', org:'008-010', date:'2026-03-09', diag:'N3000',  unit:'5440,00',  provTax:'473637912',  payable:'5440,00',  claim:'1856780', comment:''                                      },
    { days:1,  uhap:'15738756', error:'Cannot find GOP with proper admission data',   client:'971895',  org:'008-005', date:'2024-08-30', diag:'R9082',  unit:'2748,00',  provTax:'362235165',  payable:'517,79',   claim:'1585979', comment:'LBE - Awaiting provider'               },
    { days:1,  uhap:'15738066', error:'Cannot find GOP with proper provider tax id',  client:'1319084', org:'100-001', date:'2026-02-18', diag:'M6089',  unit:'7686,50',  provTax:'810851756',  payable:'3403,00',  claim:'1844453', comment:''                                      },
];

const REUPLOAD_INVOICES = [
    { days:71, uhap:'15515259', client:'1274745', org:'190-001', date:'2025-12-03', diag:'Z00129',  unit:'1215,00',  provTax:'520970462',  payable:'927,28',  claim:'1788880', gopId:'3865693', invId:'3865759' },
    { days:70, uhap:'15519802', client:'1291486', org:'178-001', date:'2025-11-15', diag:'S0181XA', unit:'308,00',   provTax:'741586031',  payable:'170,57',  claim:'1793762', gopId:'3827099', invId:'3865549' },
    { days:70, uhap:'15517902', client:'1289576', org:'190-001', date:'2025-12-18', diag:'L02212',  unit:'780,00',   provTax:'841887834',  payable:'495,81',  claim:'1826038', gopId:'3865616', invId:'3865690' },
    { days:68, uhap:'15525421', client:'1290686', org:'100-011', date:'2025-11-15', diag:'K8590',   unit:'1683,00',  provTax:'934917037',  payable:'1683,00', claim:'1792821', gopId:'3871766', invId:'3871799' },
    { days:68, uhap:'15525420', client:'1290686', org:'100-011', date:'2025-11-14', diag:'K8590',   unit:'1373,00',  provTax:'934917037',  payable:'1373,00', claim:'1792821', gopId:'3792695', invId:'3871800' },
    { days:67, uhap:'15529744', client:'1291486', org:'178-001', date:'2025-11-17', diag:'S2242XA', unit:'484,74',   provTax:'742932237',  payable:'92,76',   claim:'1793762', gopId:'3874953', invId:'3874993' },
    { days:67, uhap:'15529725', client:'1291486', org:'178-001', date:'2025-11-21', diag:'S42022A', unit:'5077,44',  provTax:'742932237',  payable:'1077,92', claim:'1793762', gopId:'3874956', invId:'3874994' },
    { days:67, uhap:'15529741', client:'1291486', org:'178-001', date:'2025-11-18', diag:'S2242XA', unit:'290,22',   provTax:'742932237',  payable:'44,00',   claim:'1793762', gopId:'3874958', invId:'3874995' },
    { days:67, uhap:'15530951', client:'1253819', org:'081-001', date:'2025-08-13', diag:'R69',     unit:'3388,00',  provTax:'366585462',  payable:'3388,00', claim:'1746877', gopId:'3874384', invId:'3874435' },
    { days:64, uhap:'15533046', client:'1281770', org:'190-001', date:'2025-11-16', diag:'O30042',  unit:'850,60',   provTax:'111630755',  payable:'288,16',  claim:'1784181', gopId:'3874746', invId:'3874770' },
    { days:64, uhap:'15537305', client:'1290686', org:'100-011', date:'2025-11-18', diag:'K8590',   unit:'726,00',   provTax:'934917037',  payable:'726,00',  claim:'1792821', gopId:'3871799', invId:'3874931' },
];

const MANUAL_HANDLING = [
    { days:572, uhap:'13880901', error:'Missing provider city',     client:'1085931', org:'178-001', date:'2024-05-03', diag:'J209',  payable:'1247,60', gop:'3347998', claim:'1524611', comment:''    },
    { days:572, uhap:'13882535', error:'Missing Tax ID',            client:'1040080', org:'060-026', date:'2024-06-28', diag:'K219',  payable:'388,40',  gop:'3344034', claim:'1527347', comment:''    },
    { days:572, uhap:'13883821', error:'Missing provider state',    client:'1040080', org:'060-026', date:'2024-06-27', diag:'P229',  payable:'512,75',  gop:'3344030', claim:'1527347', comment:''    },
    { days:572, uhap:'13882563', error:'Missing provider country',  client:'1040080', org:'060-026', date:'2024-07-02', diag:'P610',  payable:'874,20',  gop:'3344036', claim:'1527347', comment:''    },
    { days:572, uhap:'13882525', error:'Missing diagnosis code',    client:'1089330', org:'018-010', date:'2024-06-04', diag:'R6889', payable:'2103,88', gop:'3354931', claim:'1529303', comment:'' },
    { days:572, uhap:'13882564', error:'Missing denial code',       client:'1040080', org:'060-026', date:'2024-06-25', diag:'P229',  payable:'291,14',  gop:'3344029', claim:'1527347', comment:'' },
    { days:572, uhap:'13882583', error:'Missing UHAP ID',           client:'1086833', org:'007-001', date:'2024-05-07', diag:'R079',  payable:'637,50',  gop:'3273647', claim:'1525747', comment:'' },
];

const ALL_ENTRIES = [
    { days:574, uhap:'13872543', client:'1103320', org:'172-001', date:'2024-06-28', diag:'R109',    unit:'565,00',    provTax:'841179794',  payable:'565,00',    gopId:'3260508', invId:'3332749', claimBroker:'3350449', claimSource:'3350414', claim:'1550099', pcf:'PCF_MH_ERCT_20240905065958.txt', export:'2024-09-05', status:'GopSettled', comment:''                },
    { days:574, uhap:'13875893', client:'1045155', org:'158-001', date:'2023-11-09', diag:'R079',    unit:'1616,00',   provTax:'362596381',  payable:'1616,00',   gopId:'3208845', invId:'3327449', claimBroker:'3328675', claimSource:'3328672', claim:'1458565', pcf:'PCF_MH_ERCT_20240821225502.txt', export:'2024-08-21', status:'GopSettled', comment:''                },
    { days:574, uhap:'13872533', client:'1110621', org:'060-026', date:'2023-11-22', diag:'Z3801',   unit:'53879,75',  provTax:'521532556',  payable:'53879,75',  gopId:'3232607', invId:'3332577', claimBroker:'3350451', claimSource:'3350416', claim:'1559109', pcf:'PCF_MH_ERCT_20240905065958.txt', export:'2024-09-05', status:'GopSettled', comment:''                },
    { days:574, uhap:'13872105', client:'1113888', org:'100-001', date:'2024-07-12', diag:'S82852A', unit:'1041,00',   provTax:'132655001',  payable:'1041,00',   gopId:'3282317', invId:'3392399', claimBroker:'3392935', claimSource:'3392876', claim:'1563202', pcf:'PCF_MH_ERCT_20241016133040.txt', export:'2024-10-16', status:'GopSettled', comment:'RGR - awaiting cc'},
    { days:574, uhap:'13873099', client:'1113888', org:'100-001', date:'2024-07-16', diag:'S82852D', unit:'547,05',    provTax:'132655001',  payable:'547,05',    gopId:'3331690', invId:'3392400', claimBroker:'3392936', claimSource:'3392877', claim:'1563202', pcf:'PCF_MH_ERCT_20241016133040.txt', export:'2024-10-16', status:'GopSettled', comment:'RGR - awaiting cc'},
    { days:574, uhap:'13874189', client:'1119004', org:'100-001', date:'2024-07-14', diag:'R599',    unit:'115,28',    provTax:'430688874',  payable:'115,28',    gopId:'3236825', invId:'3327466', claimBroker:'3328677', claimSource:'3328674', claim:'1568943', pcf:'PCF_MH_ERCT_20240821225502.txt', export:'2024-08-21', status:'GopSettled', comment:''                },
    { days:574, uhap:'13872128', client:'1113888', org:'100-001', date:'2024-07-23', diag:'S82852D', unit:'480,00',    provTax:'132655001',  payable:'480,00',    gopId:'3286289', invId:'3392401', claimBroker:'3392937', claimSource:'3392878', claim:'1563202', pcf:'PCF_MH_ERCT_20241016133040.txt', export:'2024-10-16', status:'GopSettled', comment:''                },
    { days:574, uhap:'13871817', client:'770911',  org:'172-001', date:'2024-06-25', diag:'H6123',   unit:'229,55',    provTax:'593209688',  payable:'229,55',    gopId:'3260854', invId:'3332808', claimBroker:'3350508', claimSource:'3350415', claim:'1552225', pcf:'PCF_MH_ERCT_20240905065958.txt', export:'2024-09-05', status:'GopSettled', comment:''                },
];

// Recovery Request, CPT Mapping, Org Manager data
const RECOVERY_REQUESTS = [
    { days:3,  uhap:'15748001', lineId:'482031', client:'1262311', date:'2026-03-14', amount:'2127,92', reason:'Overpayment',    status:'pending'    },
    { days:5,  uhap:'15745230', lineId:'293847', client:'1168331', date:'2026-03-12', amount:'946,80',  reason:'Duplicate claim', status:'processing' },
    { days:8,  uhap:'15741988', lineId:'105629', client:'1247589', date:'2026-03-09', amount:'2244,57', reason:'Policy lapsed',   status:'pending'    },
    { days:12, uhap:'15737440', lineId:'847302', client:'706093',  date:'2026-03-05', amount:'1184,16', reason:'Overpayment',    status:'pending'    },
    { days:15, uhap:'15733890', lineId:'391047', client:'1274223', date:'2026-03-02', amount:'50,36',   reason:'Duplicate claim', status:'settled'    },
    { days:18, uhap:'15730104', lineId:'653190', client:'1322220', date:'2026-02-27', amount:'256,54',  reason:'Fraud suspected', status:'rejected'   },
    { days:20, uhap:'15728560', lineId:'274839', client:'1190166', date:'2026-02-25', amount:'298,08',  reason:'Policy lapsed',   status:'processing' },
    { days:22, uhap:'15726001', lineId:'920184', client:'1247589', date:'2026-02-23', amount:'411,57',  reason:'Overpayment',    status:'pending'    },
    { days:25, uhap:'15722449', lineId:'538276', client:'1168331', date:'2026-02-20', amount:'410,16',  reason:'Duplicate claim', status:'settled'    },
    { days:30, uhap:'15718890', lineId:'401823', client:'1045425', date:'2026-02-15', amount:'840,00',  reason:'Overpayment',    status:'pending'    },
];

const CPT_MAPPINGS = [
    { cpt:'99213', desc:'Office outpatient visit, established',  icd:'Z00.00',  org:'007-001', created:'2026-01-10', status:'active'   },
    { cpt:'99285', desc:'Emergency department visit, high',      icd:'S8992XA', org:'008-005', created:'2026-01-15', status:'active'   },
    { cpt:'93000', desc:'Electrocardiogram routine ECG',         icd:'I4891',   org:'100-001', created:'2025-11-20', status:'active'   },
    { cpt:'71046', desc:'X-ray chest, 2 views',                  icd:'R09.89',  org:'143-001', created:'2025-12-05', status:'active'   },
    { cpt:'99232', desc:'Subsequent hospital care',              icd:'Z9484',   org:'081-001', created:'2026-02-01', status:'active'   },
    { cpt:'36415', desc:'Venipuncture, routine',                 icd:'Z13.88',  org:'190-001', created:'2026-01-22', status:'inactive' },
    { cpt:'99214', desc:'Office outpatient visit, moderate',     icd:'J029',    org:'060-026', created:'2026-02-10', status:'active'   },
    { cpt:'70553', desc:'MRI brain without/with contrast',       icd:'G43.909', org:'008-010', created:'2025-10-18', status:'active'   },
    { cpt:'27447', desc:'Total knee replacement',                icd:'M17.11',  org:'007-001', created:'2026-01-30', status:'review'   },
    { cpt:'45380', desc:'Colonoscopy with biopsy',               icd:'K92.1',   org:'100-001', created:'2026-02-14', status:'active'   },
];

const ORGANIZATIONS = [
    { id:'007-001', name:'Nordic Health Partners',     country:'Norway',    email:'ops@nhp.no',       tax:'NO987654321', status:'active',   claims:1247, gops:892  },
    { id:'008-005', name:'Baltic Medical Group',       country:'Estonia',   email:'claims@bmg.ee',    tax:'EE123456789', status:'active',   claims:2103, gops:1780 },
    { id:'100-001', name:'Scandinavian Care Alliance', country:'Sweden',    email:'billing@sca.se',   tax:'SE556677889', status:'active',   claims:987,  gops:745  },
    { id:'143-001', name:'Copenhagen Clinic Network',  country:'Denmark',   email:'adj@ccn.dk',       tax:'DK12345678',  status:'active',   claims:1654, gops:1320 },
    { id:'190-001', name:'Helsinki Medica',             country:'Finland',   email:'invoices@hm.fi',   tax:'FI12345678',  status:'inactive', claims:423,  gops:310  },
    { id:'081-001', name:'Riga Regional Hospital',     country:'Latvia',    email:'finance@rrh.lv',   tax:'LV40003251',  status:'active',   claims:718,  gops:590  },
    { id:'060-026', name:'Vilnius Medical Center',     country:'Lithuania', email:'claims@vmc.lt',    tax:'LT100001234', status:'active',   claims:532,  gops:421  },
    { id:'008-010', name:'Tallinn Health Services',    country:'Estonia',   email:'adj@ths.ee',       tax:'EE987654321', status:'review',   claims:284,  gops:198  },
    { id:'178-001', name:'Stockholm Surgery Center',   country:'Sweden',    email:'billing@ssc.se',   tax:'SE999888777', status:'active',   claims:1891, gops:1540 },
];

// ===================================================
//  VIEW RENDERERS
// ===================================================

function renderMissingClaims() {
    const rows = MISSING_CLAIMS.map(r => `
    <tr>
        <td>${daysBadge(r.days)}</td>
        <td class="mono">${r.uhap}</td>
        <td style="white-space:normal;line-height:1.4;max-width:180px">${r.error}</td>
        <td class="mono">${r.client}</td>
        <td>${name(r.client)}</td>
        <td class="mono">${r.org}</td>
        <td class="mono">${r.date}</td>
        <td><span class="diag-code">${r.diag}</span></td>
        <td class="mono num-right">${usd(r.unit)}</td>
        <td class="mono num-right">${usd(r.payable)}</td>
        <td><input class="cell-input mc-claim-input" type="text" placeholder="Claim #"></td>
        <td><input class="cell-input wide mc-comment-input" type="text" placeholder="Add comment…"></td>
        ${taskCreationCell(r.org)}
        <td>
            <div class="action-group">
                <button class="btn btn-lime btn-sm btn-magnetic mc-update-btn" data-uhap="${r.uhap}">Update</button>
                <button class="btn btn-danger btn-sm btn-magnetic mc-remove-btn" data-uhap="${r.uhap}">Remove</button>
            </div>
        </td>
    </tr>`).join('');

    return `<div class="view">
        <div class="modal-backdrop" id="mc-confirm-backdrop">
            <div class="modal modal-sm">
                <div class="modal-header">
                    <span class="modal-title" id="mc-confirm-title">Confirm Action</span>
                    <button class="modal-close" id="mc-confirm-close" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                </div>
                <div class="modal-body"><p class="modal-confirm-text" id="mc-confirm-text"></p></div>
                <div class="modal-footer">
                    <button class="btn btn-ghost btn-magnetic" id="mc-confirm-cancel">Cancel</button>
                    <button class="btn btn-lime btn-magnetic" id="mc-confirm-ok">Confirm</button>
                </div>
            </div>
        </div>
        <div class="recovery-toast" id="mc-toast"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg><span id="mc-toast-msg"></span></div>
        <div class="view-hero">
            <div class="view-hero-left">
                <div class="view-hero-title">Missing Claims</div>
                <div class="view-hero-sub">Diagnosis mismatches, policy errors &amp; unresolved submissions</div>
            </div>
            <div class="view-hero-right">
                <div>
                    <div class="view-hero-count">42</div>
                    <div class="view-hero-count-lbl">Pending</div>
                </div>
            </div>
        </div>
        <div class="section-header">
            <div style="display:flex;align-items:center;gap:10px">
                ${searchBar('Search UHAP ID, client, diagnosis…', `
                    <select class="select">
                        <option>All organizations</option>
                        <option>007-001</option><option>008-005</option>
                        <option>143-001</option><option>190-001</option>
                    </select>
                    <select class="select">
                        <option>All error types</option>
                        <option>Diagnosis code mismatch</option>
                        <option>Wrong claim provided</option>
                        <option>Treatment outside of policy period</option>
                    </select>
                `)}
            </div>
            ${perPage()}
        </div>
        <div class="table-wrapper">
            <div class="table-scroll">
                <table>
                    <thead><tr>
                        ${th('Days since import')}
                        ${th('UHAP ID')}
                        ${th('Error Description')}
                        ${th('Client ID')}
                        ${th('Policy Holder Name')}
                        ${th('Organization')}
                        ${th('Treatment Date')}
                        ${th('Diagnosis Code')}
                        ${th('Unit Price')}
                        ${th('Payable Amount')}
                        ${th('Claim number', false)}
                        ${th('Comment', false)}
                        ${th('Task Creation', false)}
                        ${th('Actions', false)}
                    </tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            ${tableFooter(42)}
        </div>
    </div>`;
}

function renderMissingGOP() {
    const rows = MISSING_GOP.map(r => `
    <tr>
        <td>${daysBadge(r.days)}</td>
        <td class="mono">${r.uhap}</td>
        <td style="white-space:normal;line-height:1.4;max-width:200px">${r.error}</td>
        <td class="mono">${r.client}</td>
        <td>${name(r.client)}</td>
        <td class="mono">${r.org}</td>
        <td class="mono">${r.date}</td>
        <td><span class="diag-code">${r.diag}</span></td>
        <td class="mono num-right">${usd(r.unit)}</td>
        <td class="mono">${r.provTax}</td>
        <td class="mono num-right">${usd(r.payable)}</td>
        <td class="mono">${r.claim}</td>
        <td><input class="cell-input gop-number-input" type="text" placeholder="GOP #"></td>
        <td style="max-width:220px"><input class="cell-input" type="text" value="${r.comment}" placeholder="Add comment…"></td>
        ${taskCreationCell(r.org)}
        <td>
            <div class="action-group">
                <button class="btn btn-lime btn-sm btn-magnetic gop-update-btn" data-uhap="${r.uhap}">Update</button>
                <button class="btn btn-warning btn-sm btn-magnetic gop-wrong-btn" data-uhap="${r.uhap}">Wrong Claim</button>
                <button class="btn btn-danger btn-sm btn-magnetic gop-remove-btn" data-uhap="${r.uhap}">Remove</button>
            </div>
        </td>
    </tr>`).join('');

    return `<div class="view">
        <div class="modal-backdrop" id="gop-confirm-backdrop">
            <div class="modal modal-sm">
                <div class="modal-header">
                    <span class="modal-title" id="gop-confirm-title">Confirm Action</span>
                    <button class="modal-close" id="gop-confirm-close" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                </div>
                <div class="modal-body"><p class="modal-confirm-text" id="gop-confirm-text"></p></div>
                <div class="modal-footer">
                    <button class="btn btn-ghost btn-magnetic" id="gop-confirm-cancel">Cancel</button>
                    <button class="btn btn-lime btn-magnetic" id="gop-confirm-ok">Confirm</button>
                </div>
            </div>
        </div>
        <div class="recovery-toast" id="gop-toast"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg><span id="gop-toast-msg"></span></div>
        <div class="view-hero">
            <div class="view-hero-left">
                <div class="view-hero-title">Missing GOP</div>
                <div class="view-hero-sub">Provider tax ID mismatches, pending GOPs &amp; admission data issues</div>
            </div>
            <div class="view-hero-right">
                <div>
                    <div class="view-hero-count">128</div>
                    <div class="view-hero-count-lbl">Pending</div>
                </div>
            </div>
        </div>
        <div class="section-header">
            <div style="display:flex;align-items:center;gap:10px">
                ${searchBar('Search UHAP ID, client, provider tax ID…', `
                    <select class="select">
                        <option>All organizations</option>
                        <option>100-001</option><option>143-001</option>
                        <option>081-001</option><option>008-005</option><option>008-010</option>
                    </select>
                `)}
            </div>
            ${perPage()}
        </div>
        <div class="table-wrapper">
            <div class="table-scroll">
                <table>
                    <thead><tr>
                        ${th('Days since import')}
                        ${th('UHAP ID')}
                        ${th('Error Description')}
                        ${th('Client ID')}
                        ${th('Policy Holder Name')}
                        ${th('Organization')}
                        ${th('Treatment Date')}
                        ${th('Diagnosis Code')}
                        ${th('Unit Price')}
                        ${th('Provider Tax Id')}
                        ${th('Payable Amount')}
                        ${th('ClaimNumber')}
                        ${th('GOP', false)}
                        ${th('Comment', false)}
                        ${th('Task Creation', false)}
                        ${th('Actions', false)}
                    </tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            ${tableFooter(128)}
        </div>
    </div>`;
}

function renderReuploadInvoices() {
    const rows = REUPLOAD_INVOICES.map(r => `
    <tr>
        <td>${daysBadge(r.days)}</td>
        <td class="mono">${r.uhap}</td>
        <td class="mono">${r.client}</td>
        <td>${name(r.client)}</td>
        <td class="mono">${r.org}</td>
        <td class="mono">${r.date}</td>
        <td><span class="diag-code">${r.diag}</span></td>
        <td class="mono num-right">${usd(r.unit)}</td>
        <td class="mono">${r.provTax}</td>
        <td class="mono num-right">${usd(r.payable)}</td>
        <td class="mono">${r.claim}</td>
        <td class="mono">${r.gopId}</td>
        <td class="mono">${r.invId}</td>
        <td>
            <div class="action-group">
                <button class="btn btn-primary btn-sm btn-magnetic ri-reupload-btn" data-uhap="${r.uhap}" data-inv="${r.invId}">Reupload</button>
                <button class="btn btn-ghost btn-sm btn-magnetic ri-missing-btn" data-uhap="${r.uhap}">Missing Claim</button>
            </div>
        </td>
    </tr>`).join('');

    return `<div class="view">
        <div class="modal-backdrop" id="ri-confirm-backdrop">
            <div class="modal modal-sm">
                <div class="modal-header">
                    <span class="modal-title" id="ri-confirm-title">Confirm Action</span>
                    <button class="modal-close" id="ri-confirm-close" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                </div>
                <div class="modal-body"><p class="modal-confirm-text" id="ri-confirm-text"></p></div>
                <div class="modal-footer">
                    <button class="btn btn-ghost btn-magnetic" id="ri-confirm-cancel">Cancel</button>
                    <button class="btn btn-lime btn-magnetic" id="ri-confirm-ok">Confirm</button>
                </div>
            </div>
        </div>
        <div class="recovery-toast" id="ri-toast"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg><span id="ri-toast-msg"></span></div>
        <div class="section-header">
            <span class="section-title">54 invoices in queue</span>
            ${perPage()}
        </div>
        ${searchBar('Search by UHAP ID, claim number, invoice ID…')}
        <div class="table-wrapper">
            <div class="table-scroll">
                <table>
                    <thead><tr>
                        ${th('Days since import')}
                        ${th('UHAP ID')}
                        ${th('Client ID')}
                        ${th('Policy Holder Name')}
                        ${th('Organization')}
                        ${th('Treatment Date')}
                        ${th('Diagnosis Code')}
                        ${th('Unit Price')}
                        ${th('Provider Tax Id')}
                        ${th('Payable Amount')}
                        ${th('ClaimNumber')}
                        ${th('GopId')}
                        ${th('Invoice Id')}
                        ${th('Actions', false)}
                    </tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            ${tableFooter(54)}
        </div>
    </div>`;
}

function renderManualHandling() {
    const rows = MANUAL_HANDLING.map((r, i) => `
    <tr>
        <td>${daysBadge(r.days)}</td>
        <td class="mono">${r.uhap}</td>
        <td style="white-space:normal;line-height:1.4;max-width:200px;font-size:12px">${r.error}</td>
        <td class="mono">${r.client}</td>
        <td>${name(r.client)}</td>
        <td class="mono">${r.org}</td>
        <td class="mono">${r.date}</td>
        <td><span class="diag-code">${r.diag}</span></td>
        <td class="mono num-right">${usd(r.payable)}</td>
        <td class="mono">${r.gop}</td>
        <td class="mono">${r.claim}</td>
        <td>${i < 5
            ? `<select class="cell-select mh-comment-select"><option value="">—</option><option value="export">Export again</option></select>`
            : `<input class="cell-input wide mh-comment-input" type="text" placeholder="Comment…" value="${r.comment}">`
        }</td>
        <td>
            <div class="action-group">
                <button class="btn btn-lime btn-sm btn-magnetic ${i < 5 ? 'mh-update-direct-btn' : 'mh-update-btn'}" data-uhap="${r.uhap}">Update</button>
                <button class="btn btn-danger btn-sm btn-magnetic mh-remove-btn" data-uhap="${r.uhap}">Remove</button>
            </div>
        </td>
    </tr>`).join('');

    return `<div class="view">
        <div class="modal-backdrop" id="mh-confirm-backdrop">
            <div class="modal modal-sm">
                <div class="modal-header">
                    <span class="modal-title" id="mh-confirm-title">Confirm Action</span>
                    <button class="modal-close" id="mh-confirm-close" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                </div>
                <div class="modal-body"><p class="modal-confirm-text" id="mh-confirm-text"></p></div>
                <div class="modal-footer">
                    <button class="btn btn-ghost btn-magnetic" id="mh-confirm-cancel">Cancel</button>
                    <button class="btn btn-lime btn-magnetic" id="mh-confirm-ok">Confirm</button>
                </div>
            </div>
        </div>
        <div class="recovery-toast" id="mh-toast"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg><span id="mh-toast-msg"></span></div>
        <div class="view-hero">
            <div class="view-hero-left">
                <div class="view-hero-title">Manual Handling</div>
                <div class="view-hero-sub">Claims requiring manual intervention &amp; adjudicator action</div>
            </div>
            <div class="view-hero-right">
                <div>
                    <div class="view-hero-count">31</div>
                    <div class="view-hero-count-lbl">Pending</div>
                </div>
            </div>
        </div>
        <div class="section-header">
            <div style="display:flex;align-items:center;gap:10px">
                ${searchBar('Search UHAP ID, client, organization…', `
                    <select class="select">
                        <option>All organizations</option>
                        <option>178-001</option><option>060-026</option>
                        <option>007-001</option><option>008-005</option><option>018-010</option>
                    </select>
                `)}
            </div>
            ${perPage()}
        </div>
        <div class="table-wrapper">
            <div class="table-scroll">
                <table>
                    <thead><tr>
                        ${th('Days since import')}
                        ${th('UHAP ID')}
                        ${th('Error Description')}
                        ${th('Client ID')}
                        ${th('Policy Holder Name')}
                        ${th('Organization')}
                        ${th('Treatment Date')}
                        ${th('Diagnosis Code')}
                        ${th('Allowed', false)}
                        ${th('Line ID')}
                        ${th('Claim number')}
                        ${th('Comment', false)}
                        ${th('Actions', false)}
                    </tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            ${tableFooter(31, 7)}
        </div>
    </div>`;
}

function renderAllEntries() {
    const rows = ALL_ENTRIES.map(r => `
    <tr>
        <td>${daysBadge(r.days)}</td>
        <td class="mono">${r.uhap}</td>
        <td class="muted">—</td>
        <td class="mono">${r.client}</td>
        <td>${name(r.client)}</td>
        <td class="mono">${r.org}</td>
        <td class="mono">${r.date}</td>
        <td><span class="diag-code">${r.diag}</span></td>
        <td class="mono num-right">${usd(r.unit)}</td>
        <td class="mono">${r.provTax}</td>
        <td class="mono num-right">${usd(r.payable)}</td>
        <td class="mono">${r.gopId}</td>
        <td class="mono">${r.invId}</td>
        <td class="mono">${r.claimBroker}</td>
        <td class="mono">${r.claimSource}</td>
        <td class="mono">${r.claim}</td>
        <td class="muted" style="font-size:11.5px;max-width:200px;overflow:hidden;text-overflow:ellipsis">${r.pcf}</td>
        <td class="mono">${r.export}</td>
        <td><span class="status-badge status-settled">${r.status}</span></td>
        <td class="muted" style="font-size:12px;max-width:120px;white-space:normal">${r.comment || '—'}</td>
    </tr>`).join('');

    return `<div class="view">
        <div class="view-hero">
            <div class="view-hero-left">
                <div class="view-hero-title">All Entries</div>
                <div class="view-hero-sub">Complete adjudication record log &mdash; all statuses &amp; organizations</div>
            </div>
            <div class="view-hero-right">
                <button class="btn btn-lime btn-magnetic" style="gap:6px">${ICONS.export} Export CSV</button>
            </div>
        </div>
        <div class="section-header">
            <div style="display:flex;align-items:center;gap:10px">
                ${searchBar('Search UHAP ID, PCF file, status…', `
                    <select class="select">
                        <option>All statuses</option>
                        <option>GopSettled</option>
                        <option>InvoiceCreated</option>
                        <option>Pending</option>
                    </select>
                    <select class="select">
                        <option>All organizations</option>
                        <option>172-001</option><option>158-001</option><option>060-026</option>
                        <option>100-001</option><option>178-001</option><option>007-001</option>
                    </select>
                `)}
            </div>
            ${perPage()}
        </div>
        <div class="table-wrapper">
            <div class="table-scroll">
                <table>
                    <thead><tr>
                        ${th('Days since import')}
                        ${th('UHAP ID')}
                        ${th('Error Description')}
                        ${th('Client ID')}
                        ${th('Policy Holder Name')}
                        ${th('Organization')}
                        ${th('Treatment Date')}
                        ${th('Diagnosis Code')}
                        ${th('Unit Price')}
                        ${th('Provider Tax Id')}
                        ${th('Payable Amount')}
                        ${th('Gop Id')}
                        ${th('Invoice Id')}
                        ${th('Claim Broker Fee Invoice Id')}
                        ${th('Claim Source Fee Invoice Id')}
                        ${th('Claim Number')}
                        ${th('Pcf File Name', false)}
                        ${th('Export Date')}
                        ${th('Status')}
                        ${th('Comment', false)}
                    </tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            ${tableFooter(574)}
        </div>
    </div>`;
}

function renderRecoveryRequest() {
    const rows = RECOVERY_REQUESTS.map(r => `
    <tr>
        <td>${daysBadge(r.days)}</td>
        <td class="mono">${r.uhap}</td>
        <td class="mono">${r.lineId}</td>
        <td class="mono">${r.client}</td>
        <td>${name(r.client)}</td>
        <td class="mono">${r.date}</td>
        <td class="mono" style="font-weight:600">${usd(r.amount)}</td>
        <td>
            <select class="select rec-denial-select" style="min-width:220px">
                <option value="" disabled selected>Select reason…</option>
                <option>Not a covered service</option>
                <option>No coverage for preventive treatments</option>
                <option>No coverage for pre-existing conditions</option>
            </select>
        </td>
        <td>
            <div class="action-group" style="justify-content:center">
                <button class="btn btn-lime btn-sm btn-magnetic rec-start-btn" data-uhap="${r.uhap}" data-amount="${r.amount}" disabled>Start Recovery</button>
                <button class="btn btn-danger btn-sm btn-magnetic">Remove</button>
            </div>
        </td>
    </tr>`).join('');

    return `<div class="view">

        <!-- Confirmation modal -->
        <div class="modal-backdrop" id="rec-confirm-backdrop">
            <div class="modal modal-sm">
                <div class="modal-header">
                    <span class="modal-title">Confirm Recovery</span>
                    <button class="modal-close" id="rec-confirm-close" type="button">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div class="modal-body" style="gap:0">
                    <p class="modal-confirm-text" id="rec-confirm-text"></p>
                    <p class="modal-confirm-sub">This action will initiate a recovery process and cannot be undone.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-ghost btn-magnetic" id="rec-confirm-cancel">Cancel</button>
                    <button class="btn btn-lime btn-magnetic" id="rec-confirm-ok">Confirm</button>
                </div>
            </div>
        </div>

        <!-- Toast acknowledgement -->
        <div class="recovery-toast" id="rec-toast">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg>
            <span id="rec-toast-msg"></span>
        </div>

        <div class="view-hero">
            <div class="view-hero-left">
                <div class="view-hero-title">Recovery Request</div>
                <div class="view-hero-sub">Overpayments, duplicate claims &amp; policy recovery actions</div>
            </div>
            <div class="view-hero-right">
                <div>
                    <div class="view-hero-count">23</div>
                    <div class="view-hero-count-lbl">Pending</div>
                </div>
            </div>
        </div>
        <div class="section-header">
            <div style="display:flex;align-items:center;gap:10px">
                ${searchBar('Search UHAP ID, client…', ``)}
            </div>
            ${perPage()}
        </div>
        <div class="table-wrapper">
            <div class="table-scroll">
                <table>
                    <thead><tr>
                        ${th('Days since import')}
                        ${th('UHAP ID')}
                        ${th('Line ID')}
                        ${th('Client ID')}
                        ${th('Policy Holder Name')}
                        ${th('Treatment Date')}
                        ${th('Amount')}
                        ${th('Denial Reason', false)}
                        ${th('Actions', false)}
                    </tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            ${tableFooter(23)}
        </div>
    </div>`;
}

function renderCPTMapping() {
    const rows = CPT_MAPPINGS.map(r => `
    <tr>
        <td><span class="cpt-code-cell">${r.cpt}</span></td>
        <td style="white-space:normal;line-height:1.4;max-width:340px">${r.desc}</td>
        <td><div class="action-group">
            <button class="btn btn-ghost btn-sm btn-magnetic cpt-edit-btn" data-cpt="${r.cpt}" data-desc="${r.desc}">${ICONS.edit} Edit</button>
            <button class="btn btn-danger btn-sm btn-magnetic cpt-delete-btn" data-cpt="${r.cpt}">${ICONS.trash}</button>
        </div></td>
    </tr>`).join('');

    return `<div class="view">
        <!-- Add Mapping Modal -->
        <div class="modal-backdrop" id="cpt-modal-backdrop">
            <div class="modal" id="cpt-modal">
                <div class="modal-header">
                    <span class="modal-title">Add CPT Mapping</span>
                    <button class="modal-close" id="cpt-modal-close" type="button">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="modal-fields">
                        <div class="modal-field">
                            <label class="modal-label">CPT Code</label>
                            <input class="modal-input" id="cpt-input-code" type="text" placeholder="e.g. 99213" autocomplete="off">
                        </div>
                        <div class="modal-field">
                            <label class="modal-label">Description</label>
                            <input class="modal-input" id="cpt-input-desc" type="text" placeholder="e.g. Office visit, established patient" autocomplete="off">
                        </div>
                    </div>
                    <div class="modal-divider">
                        <span>or import from file</span>
                    </div>
                    <label class="modal-upload-btn" id="cpt-upload-label">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                        <span id="cpt-upload-text">Import Excel file (.xlsx)</span>
                        <input type="file" accept=".xlsx,.xls,.csv" id="cpt-file-input" style="display:none">
                    </label>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-ghost btn-magnetic" id="cpt-modal-cancel">Cancel</button>
                    <button class="btn btn-lime btn-magnetic" id="cpt-modal-submit">
                        ${ICONS.plus} Submit
                    </button>
                </div>
            </div>
        </div>

        <!-- Delete Confirm Modal -->
        <div class="modal-backdrop" id="cpt-confirm-backdrop">
            <div class="modal modal-sm">
                <div class="modal-header">
                    <span class="modal-title">Delete CPT Mapping</span>
                    <button class="modal-close" id="cpt-confirm-close" type="button">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div class="modal-body" style="gap:0">
                    <p class="modal-confirm-text">Are you sure you want to delete CPT code <span class="modal-confirm-code" id="cpt-confirm-code"></span>?</p>
                    <p class="modal-confirm-sub">This action cannot be undone.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-ghost btn-magnetic" id="cpt-confirm-cancel">Cancel</button>
                    <button class="btn btn-danger btn-magnetic" id="cpt-confirm-delete">${ICONS.trash} Delete</button>
                </div>
            </div>
        </div>

        <div class="section-header">
            <span class="section-title">${CPT_MAPPINGS.length} mappings configured</span>
            <div style="display:flex;align-items:center;gap:8px">
                <button class="btn btn-lime btn-magnetic" id="cpt-add-btn">${ICONS.plus} Add Mapping</button>
                ${perPage()}
            </div>
        </div>
        ${searchBar('Search by CPT code or description…')}
        <div class="table-wrapper">
            <div class="table-scroll">
                <table>
                    <thead><tr>
                        ${th('CPT Code')}${th('Description', false)}${th('Actions', false)}
                    </tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            ${tableFooter(CPT_MAPPINGS.length, CPT_MAPPINGS.length)}
        </div>
    </div>`;
}

function renderOrgManager() {
    const TEAM_OPTS = ['Prague GER','Prague ITA','Prague SPA','Prague CZE','Prague POL','Prague Inter','Bangkok Nordic','Bangkok UK'];

    function respCell(trigger, val) {
        if (trigger === 'External') {
            return `<input class="input input-plain org-resp-input" type="text" placeholder="email@domain.com" value="${val || ''}">`;
        }
        return `<select class="select org-resp-select">${TEAM_OPTS.map(t => `<option${t === (val || 'Prague GER') ? ' selected' : ''}>${t}</option>`).join('')}</select>`;
    }

    const rows = ORGANIZATIONS.map(o => `
    <tr>
        <td><input class="input input-plain org-name-input" type="text" value="${o.name}" placeholder="Organization name"></td>
        <td style="width:160px">
            <select class="select org-trigger-select">
                <option>ECA</option>
                <option>ECA + ECL</option>
                <option>External</option>
            </select>
        </td>
        <td class="org-resp-cell">${respCell('ECA', '')}</td>
        <td style="width:44px;text-align:center">
            <button class="btn btn-danger btn-sm btn-magnetic org-row-delete">${ICONS.trash}</button>
        </td>
    </tr>`).join('');

    return `<div class="view">
        <div class="modal-backdrop" id="org-del-backdrop">
            <div class="modal modal-sm">
                <div class="modal-header">
                    <span class="modal-title">Confirm Removal</span>
                    <button class="modal-close" id="org-del-close" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                </div>
                <div class="modal-body"><p class="modal-confirm-text" id="org-del-text"></p></div>
                <div class="modal-footer">
                    <button class="btn btn-ghost btn-magnetic" id="org-del-cancel">Cancel</button>
                    <button class="btn btn-danger btn-magnetic" id="org-del-ok">Remove</button>
                </div>
            </div>
        </div>
        <div class="recovery-toast" id="org-toast"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg><span id="org-toast-msg"></span></div>
        <div class="section-header">
            <span class="section-title">${ORGANIZATIONS.length} organizations</span>
            <button class="btn btn-lime btn-magnetic" id="org-add-btn">${ICONS.plus} Add Organization</button>
        </div>
        <div class="table-wrapper">
            <div class="table-scroll">
                <table id="org-table">
                    <thead><tr>
                        <th>Organization</th>
                        <th style="width:160px">Trigger Type</th>
                        <th>Responsible</th>
                        <th style="width:44px"></th>
                    </tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </div>
    </div>`;
}

const EXT_AUTH = [
    { days:1,  uhap:'15738749', uhapId:'14738749', lineId:'391042', caseNum:'1782634', client:'1262311', org:'007-001', date:'2025-09-12', diag:'S8992XA', payable:'2127,92', facility:'Oslo University Hospital',       recipientEmail:'claims@nordicsure.no'   },
    { days:2,  uhap:'15738759', uhapId:'14738759', lineId:'182736', caseNum:'1719483', client:'1168331', org:'143-001', date:'2026-03-04', diag:'R509',    payable:'946,80',  facility:'Rigshospitalet',                 recipientEmail:'auth@cph-insure.dk'     },
    { days:0,  uhap:'15742576', uhapId:'14742576', lineId:'647291', caseNum:'1756291', client:'1247589', org:'008-005', date:'2026-03-03', diag:'Z0000',   payable:'2244,57', facility:'North Estonia Medical Centre',   recipientEmail:'coverage@baltichealth.ee'},
    { days:5,  uhap:'15740163', uhapId:'14740163', lineId:'503847', caseNum:'1703847', client:'706093',  org:'008-005', date:'2026-03-03', diag:'E109',    payable:'1184,16', facility:'Tartu University Hospital',      recipientEmail:'coverage@baltichealth.ee'},
    { days:3,  uhap:'15742575', uhapId:'14742575', lineId:'729384', caseNum:'1748291', client:'1247589', org:'008-005', date:'2026-03-02', diag:'Z1231',   payable:'499,55',  facility:'North Estonia Medical Centre',   recipientEmail:'coverage@baltichealth.ee'},
    { days:12, uhap:'15741448', uhapId:'14741448', lineId:'103847', caseNum:'1763920', client:'1274223', org:'190-001', date:'2026-02-12', diag:'M1711',   payable:'50,36',   facility:'Helsinki University Hospital',   recipientEmail:'requests@fennia.fi'     },
    { days:0,  uhap:'15741166', uhapId:'14741166', lineId:'584920', caseNum:'1729384', client:'1322220', org:'190-001', date:'2026-03-04', diag:'J310',    payable:'256,54',  facility:'Helsinki University Hospital',   recipientEmail:'requests@fennia.fi'     },
    { days:7,  uhap:'15742970', uhapId:'14742970', lineId:'273948', caseNum:'1784736', client:'1190166', org:'007-001', date:'2026-02-26', diag:'J4520',   payable:'298,08',  facility:'St. Olavs Hospital',             recipientEmail:'claims@nordicsure.no'   },
    { days:0,  uhap:'15746709', uhapId:'14746709', lineId:'839201', caseNum:'1791034', client:'1247589', org:'008-005', date:'2026-03-05', diag:'F411',    payable:'411,57',  facility:'North Estonia Medical Centre',   recipientEmail:'coverage@baltichealth.ee'},
    { days:1,  uhap:'15746039', uhapId:'14746039', lineId:'461837', caseNum:'1726483', client:'1168331', org:'143-001', date:'2026-03-04', diag:'R509',    payable:'410,16',  facility:'Herlev Hospital',                recipientEmail:'auth@cph-insure.dk'     },
];

function renderExtAuth() {
    // Group invoices by Member ID
    const groups = {};
    EXT_AUTH.forEach(r => {
        if (!groups[r.client]) groups[r.client] = [];
        groups[r.client].push(r);
    });

    const tbody = Object.entries(groups).map(([clientId, invoices]) => {
        const memberName = name(clientId);
        const groupRow = `<tr class="cq-group-row">
            <td colspan="12">
                <span class="cq-group-label">${memberName}</span>
                <span class="cq-group-count">${invoices.length} invoice${invoices.length > 1 ? 's' : ''}</span>
                <button class="btn btn-ghost btn-sm cq-select-all-btn" data-member="${clientId}" style="margin-left:12px;font-size:11.5px;padding:3px 10px">Select All</button>
            </td>
        </tr>`;
        const dataRows = invoices.map(r => `<tr class="cq-data-row">
            <td><input type="checkbox" class="cq-check" data-member="${r.client}" data-uhap="${r.uhap}" data-amount="${r.payable}" data-date="${r.date}" data-diag="${r.diag}" data-facility="${r.facility}" data-email="${r.recipientEmail}"></td>
            <td class="mono">${r.org}</td>
            <td class="mono">${r.uhapId}</td>
            <td>${memberName}</td>
            <td class="mono">${clientId}</td>
            <td class="mono">${r.lineId}</td>
            <td class="mono">${r.caseNum}</td>
            <td class="mono">${r.date}</td>
            <td style="white-space:normal;max-width:180px;line-height:1.3">${r.facility}</td>
            <td><span class="diag-code">${r.diag}</span></td>
            <td class="mono">${usd(r.payable)}</td>
            <td style="font-size:12px;white-space:normal;text-align:center">
                <div style="display:flex;flex-direction:column;gap:5px;align-items:center">
                    <div style="display:flex;align-items:center;gap:7px">
                        <span style="color:var(--text-500)">${r.recipientEmail}</span>
                        <button class="btn btn-ghost cq-cc-btn" style="padding:2px 8px;font-size:10px;height:auto;line-height:1.6;flex-shrink:0" data-member="${r.client}">+ CC</button>
                    </div>
                    <div class="cq-cc-chips-wrap" data-member="${r.client}"></div>
                </div>
            </td>
        </tr>`).join('');
        return groupRow + dataRows;
    }).join('');

    return `<div class="view">

        <!-- Send Coverage Request modal -->
        <div class="modal-backdrop" id="cq-send-backdrop">
            <div class="modal">
                <div class="modal-header">
                    <span class="modal-title">Send Coverage Request</span>
                    <button class="modal-close" id="cq-send-close" type="button">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div class="modal-body" style="gap:12px">
                    <p class="modal-confirm-text" id="cq-modal-member-line"></p>
                    <div class="cq-modal-invoices" id="cq-modal-invoices"></div>
                    <div class="cq-modal-to">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;flex-shrink:0;opacity:1;color:var(--lime)"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        <span style="color:rgba(255,255,255,0.75);font-size:12px">To:</span>
                        <span class="modal-confirm-code" id="cq-modal-email" style="font-size:13px"></span>
                    </div>
                    <div id="cq-modal-cc-row" style="display:none" class="cq-modal-to" style="flex-wrap:wrap;gap:6px">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;flex-shrink:0;color:rgba(255,255,255,0.5)"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        <span style="color:rgba(255,255,255,0.75);font-size:12px">CC:</span>
                        <div id="cq-modal-cc-chips" style="display:flex;flex-wrap:wrap;gap:5px"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-ghost btn-magnetic" id="cq-send-cancel">Cancel</button>
                    <button class="btn btn-lime btn-magnetic" id="cq-send-confirm">Send</button>
                </div>
            </div>
        </div>

        <!-- CC Recipients modal -->
        <div class="modal-backdrop" id="cq-cc-backdrop">
            <div class="modal modal-sm">
                <div class="modal-header">
                    <span class="modal-title">Add CC Recipients</span>
                    <button class="modal-close" id="cq-cc-close" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                </div>
                <div class="modal-body" style="gap:8px">
                    <label class="modal-label">Email addresses</label>
                    <textarea class="modal-input modal-textarea" id="cq-cc-input" placeholder="email@domain.com; email2@domain.com" rows="3"></textarea>
                    <p style="font-size:11px;color:rgba(255,255,255,0.35);margin:0">Separate multiple addresses with semicolons ( ; )</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-ghost btn-magnetic" id="cq-cc-cancel">Cancel</button>
                    <button class="btn btn-lime btn-magnetic" id="cq-cc-save" disabled>Save</button>
                </div>
            </div>
        </div>

        <!-- Toast -->
        <div class="recovery-toast" id="cq-toast">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg>
            <span id="cq-toast-msg"></span>
        </div>

        <div class="view-hero">
            <div class="view-hero-left">
                <div class="view-hero-title">External Coverage Queue</div>
                <div class="view-hero-sub">Invoices pending coverage request dispatch to external insurers — grouped by member</div>
            </div>
            <div class="view-hero-right">
                <div>
                    <div class="view-hero-count">${EXT_AUTH.length}</div>
                    <div class="view-hero-count-lbl">Pending</div>
                </div>
            </div>
        </div>

        <div class="section-header">
            <div style="display:flex;align-items:center;gap:10px">
                ${searchBar('Search member, facility, diagnosis, org…', `
                    <select class="select">
                        <option>All organizations</option>
                        <option>007-001</option><option>143-001</option>
                        <option>008-005</option><option>190-001</option>
                    </select>
                `)}
            </div>
            <div style="display:flex;align-items:center;gap:10px">
                <div class="cq-warning" id="cq-warning" style="display:none">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;flex-shrink:0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    Cannot mix invoices from different members
                </div>
                <button class="btn btn-lime btn-magnetic" id="cq-send-btn" disabled>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    Send Coverage Request
                </button>
            </div>
        </div>

        <div class="table-wrapper">
            <div class="table-scroll">
                <table id="cq-table">
                    <thead><tr>
                        <th style="width:40px"></th>
                        ${th('Organization')}
                        ${th('UHAP ID')}
                        ${th('Member Name')}
                        ${th('Member ID')}
                        ${th('Line ID')}
                        ${th('Case Number')}
                        ${th('Date of Service')}
                        ${th('Facility Name', false)}
                        ${th('Diagnosis')}
                        ${th('Allowed Amount')}
                        <th style="text-align:center">Recipient Email</th>
                    </tr></thead>
                    <tbody>${tbody}</tbody>
                </table>
            </div>
            ${tableFooter(EXT_AUTH.length)}
        </div>
    </div>`;
}

// ===================================================
//  LANDING PAGE
// ===================================================

function renderLanding() {
    const navCards = [
        { view:'missing-claims',    title:'Missing Claims',       desc:'Diagnosis mismatches & policy errors',     count:'42',  iconCls:'lci-red',   section:'Claims',     icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="9"/><line x1="15" y1="15" x2="9" y2="9"/></svg>` },
        { view:'missing-gop',       title:'Missing GOP',          desc:'Provider tax ID & GOP resolution',         count:'128', iconCls:'lci-amber', section:'Claims',     icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="10" cy="15" r="2"/><path d="M20 17l-2-2 2-2"/></svg>` },
        { view:'reupload-invoices', title:'Reupload Invoices',    desc:'Failed invoice upload queue',              count:'',    iconCls:'lci-sky',   section:'Claims',     icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>` },
        { view:'manual-handling',   title:'Manual Handling',      desc:'Claims requiring manual intervention',     count:'31',  iconCls:'lci-navy',  section:'Claims',     icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>` },
        { view:'recovery-request',  title:'Recovery Request',     desc:'Overpayments & duplicate claims',          count:'',    iconCls:'lci-lime',  section:'Management', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.67"/></svg>` },
        { view:'cpt-mapping',       title:'CPT Code Mapping',     desc:'Procedure to diagnosis code mappings',     count:'',    iconCls:'lci-sky',   section:'Management', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>` },
        { view:'org-manager',       title:'Organization Manager', desc:'Provider network & organization config',   count:'',    iconCls:'lci-navy',  section:'Management', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><line x1="9" y1="22" x2="9" y2="12"/><line x1="15" y1="22" x2="15" y2="12"/><line x1="3" y1="12" x2="21" y2="12"/></svg>` },
        { view:'wrong-member-id',   title:'Wrong Member ID',      desc:'Mismatched or invalid member identifiers', count:'14',  iconCls:'lci-red',   section:'Management', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="17" y1="11" x2="23" y2="11"/></svg>` },
        { view:'line-mismatches',   title:'Line Count / Order Mismatches', desc:'Export line count & ordering discrepancies', count:'18', iconCls:'lci-violet', section:'Management', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/><polyline points="17 2 21 6 17 10"/></svg>` },
        { view:'fee-invoice',       title:'Fee Invoice',                   desc:'Invoice fee generation automation per org',  count:'',   iconCls:'lci-lime',   section:'Management', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>` },
        { view:'ext-auth',          title:'External Coverage Queue',  desc:'Coverage request dispatch queue for external orgs', count:'67',  iconCls:'lci-sky',   section:'Claims',     icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>` },
        { view:'all-entries',       title:'All Entries',          desc:'Complete adjudication record log',         count:'',    iconCls:'lci-green', section:'Records',    icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>` },
    ];

    const cards = navCards.map(c => `
    <div class="landing-card" data-view="${c.view}">
        <div class="landing-card-icon ${c.iconCls}">${c.icon}</div>
        <div class="landing-card-body">
            <div class="landing-card-title">${c.title}</div>
        </div>
        <div class="landing-card-footer">
            ${c.count ? `<span class="landing-card-count has-count">${c.count}</span>` : `<span></span>`}
            <span class="landing-card-badge">${c.section}</span>
            <span class="landing-card-arrow">${ICONS.arrow}</span>
        </div>
    </div>`).join('');

    return `<div class="landing-page">
        <header class="landing-header">
            <div class="landing-brand">
                <div class="brand-mark">EC</div>
                <div class="brand-text">
                    <span class="brand-name">Euro-Center</span>
                    <span class="brand-sub">EDI Adjudication</span>
                </div>
            </div>
            <div class="landing-user">
                <span class="landing-date">${new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}</span>
                <div class="landing-user-avatar">WK</div>
                <span style="color:rgba(255,255,255,0.85);font-weight:600">WKN</span>
                <div class="topbar-badge">EURO-CENTER</div>
            </div>
        </header>
        <div class="landing-hero">
            <div class="landing-hero-inner">
                <div class="landing-hero-text">
                    <p class="landing-greeting">Welcome back,</p>
                    <h1 class="landing-name">WKN<span>.</span></h1>
                    <p class="landing-subtitle">EDI Adjudication Tool &mdash; Euro-Center</p>
                </div>
                <div class="landing-hero-logo">
                    <img src="eclogoruim.jpg" alt="Euro-Center" class="landing-ec-logo">
                </div>
            </div>
            <div class="landing-stats-row">
                <div class="landing-stat-card lsc-red" data-view="missing-claims">
                    <div class="lsc-accent"></div>
                    <span class="landing-stat-val">42</span>
                    <span class="landing-stat-lbl">Missing Claims</span>
                </div>
                <div class="landing-stat-card lsc-amber" data-view="missing-gop">
                    <div class="lsc-accent"></div>
                    <span class="landing-stat-val">128</span>
                    <span class="landing-stat-lbl">Missing GOP</span>
                </div>
                <div class="landing-stat-card lsc-blue" data-view="manual-handling">
                    <div class="lsc-accent"></div>
                    <span class="landing-stat-val">31</span>
                    <span class="landing-stat-lbl">Manual Handling</span>
                </div>
                <div class="landing-stat-card lsc-sky" data-view="ext-auth">
                    <div class="lsc-accent"></div>
                    <span class="landing-stat-val">67</span>
                    <span class="landing-stat-lbl">Ext. Authorizations</span>
                </div>
                <div class="landing-stat-card lsc-rose" data-view="wrong-member-id">
                    <div class="lsc-accent"></div>
                    <span class="landing-stat-val">14</span>
                    <span class="landing-stat-lbl">Wrong Member ID</span>
                </div>
                <div class="landing-stat-card lsc-violet" data-view="line-mismatches">
                    <div class="lsc-accent"></div>
                    <span class="landing-stat-val">18</span>
                    <span class="landing-stat-lbl">Line Mismatches</span>
                </div>
            </div>
        </div>
        <div class="landing-search-section">
            <div class="landing-search-card">
                <div class="landing-search-label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    Search Invoice
                </div>
                <div class="landing-srch-type" id="invoice-type-wrap">
                    <span class="landing-search-type-label">Search by</span>
                    <div class="landing-srch-dropdown" id="invoice-type-dropdown">
                        <button class="landing-srch-dropdown-btn" id="invoice-type-btn" type="button">
                            <span id="invoice-type-text">UHAP Claim ID</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                        </button>
                        <ul class="landing-srch-menu" id="invoice-type-menu">
                            <li class="landing-srch-opt active" data-type="uhap">UHAP Claim ID</li>
                            <li class="landing-srch-opt" data-type="member">Member ID</li>
                        </ul>
                    </div>
                </div>
                <div class="landing-search-input-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input class="landing-search-input" id="invoice-search-input" type="text" placeholder="Enter UHAP Claim ID…" autocomplete="off" spellcheck="false">
                </div>
                <div class="landing-search-actions">
                    <button class="landing-search-btn btn-magnetic" id="invoice-search-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        Search
                    </button>
                </div>
            </div>
        </div>
        <div class="landing-nav">
            <p class="landing-nav-title">Select a module to begin</p>
            <div class="landing-grid">${cards}</div>
        </div>
        <footer class="landing-footer">
            <span class="landing-footer-copy">&copy; 2026 &mdash; Euro-Center &mdash; Self Maintenance UI</span>
            <span class="landing-footer-version">v2.0.0</span>
        </footer>
    </div>`;
}

// ===================================================
//  SEARCH RESULT VIEWS
// ===================================================

let _srchQuery = '';
let _srchType  = 'uhap';

const UHAP_MOCK = {
    uhap:        '14084712',
    memberName:  'John A. Martinez',
    memberId:    '909000100847',
    dob:         'Mar 15, 1978',
    facility:    'Athens General Hospital',
    taxId:       '84-2916543',
    billed:      12450.00,
    savings:     3245.00,
    allowed:     9205.00,
    lines: [
        { line:1, cpt:'99213', desc:'Office visit — established patient',     billed:350,  savings:45,  allowed:305  },
        { line:2, cpt:'85025', desc:'Complete CBC with differential',          billed:180,  savings:60,  allowed:120  },
        { line:3, cpt:'80053', desc:'Comprehensive metabolic panel',           billed:220,  savings:80,  allowed:140  },
        { line:4, cpt:'71046', desc:'Chest X-ray, 2 views',                   billed:450,  savings:120, allowed:330  },
        { line:5, cpt:'93000', desc:'Electrocardiogram — routine',            billed:380,  savings:95,  allowed:285  },
        { line:6, cpt:'97110', desc:'Therapeutic exercises (30 min)',          billed:290,  savings:75,  allowed:215  },
        { line:7, cpt:'99232', desc:'Subsequent hospital care, 25 min',        billed:610,  savings:160, allowed:450  },
        { line:8, cpt:'27447', desc:'Total knee arthroplasty',                billed:9970, savings:2610,allowed:7360 },
    ],
};

const MEMBER_MOCK = {
    name:     'Sarah K. Thompson',
    memberId: '909000100512',
    dob:      'Jul 22, 1965',
    org:      'Nordic Sure AS',
    invoices: [
        { lineId:'384712', uhap:'14084712', billed:12450.00, allowed:9205.00, dos:'Jan 08, 2025', facility:'Athens General Hospital',  status:'Settled'  },
        { lineId:'371341', uhap:'14071341', billed:4870.00,  allowed:3620.00, dos:'Nov 14, 2024', facility:'Medipolis Clinic',          status:'Settled'  },
        { lineId:'363022', uhap:'14063022', billed:1980.00,  allowed:1540.00, dos:'Sep 03, 2024', facility:'Athens General Hospital',  status:'Imported' },
        { lineId:'355189', uhap:'14055189', billed:8340.00,  allowed:6250.00, dos:'Jun 17, 2024', facility:'Euro Diagnostics Center',  status:'Imported' },
        { lineId:'341076', uhap:'14041076', billed:660.00,   allowed:520.00,  dos:'Mar 29, 2024', facility:'Medipolis Clinic',          status:'Received' },
    ],
};

function renderSearchUhap() {
    const d = UHAP_MOCK;
    const lineRows = d.lines.map(l => `
        <tr>
            <td class="mono" style="color:var(--text-500)">${l.line}</td>
            <td><span class="cpt-code-cell">${l.cpt}</span></td>
            <td style="white-space:normal;line-height:1.4;max-width:280px">${l.desc}</td>
            <td class="mono num-right">${usd(l.billed)}</td>
            <td class="mono num-right" style="color:var(--green)">${usd(l.savings)}</td>
            <td class="mono num-right" style="color:var(--navy);font-weight:700">${usd(l.allowed)}</td>
        </tr>`).join('');
    const totBilled  = d.lines.reduce((s,l) => s + l.billed,  0);
    const totSavings = d.lines.reduce((s,l) => s + l.savings, 0);
    const totAllowed = d.lines.reduce((s,l) => s + l.allowed, 0);

    return `<div class="view">
        <button class="srch-back-btn" id="srch-back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Search
        </button>

        <div class="inv-overview">
            <div class="inv-overview-header">
                <div>
                    <div class="inv-overview-id">UHAP Claim ID</div>
                    <div class="inv-overview-title">${d.uhap}</div>
                </div>
                <div class="inv-totals-row">
                    <div class="inv-total-cell">
                        <div class="inv-total-lbl">Total Billed</div>
                        <div class="inv-total-val">${usd(d.billed)}</div>
                    </div>
                    <div class="inv-total-cell savings">
                        <div class="inv-total-lbl">Total Savings</div>
                        <div class="inv-total-val">${usd(d.savings)}</div>
                    </div>
                    <div class="inv-total-cell allowed">
                        <div class="inv-total-lbl">Total Allowed</div>
                        <div class="inv-total-val">${usd(d.allowed)}</div>
                    </div>
                </div>
            </div>
            <div class="inv-fields">
                <div>
                    <div class="inv-field-lbl">Member Name</div>
                    <div class="inv-field-val">${d.memberName}</div>
                </div>
                <div>
                    <div class="inv-field-lbl">Member ID</div>
                    <div class="inv-field-val mono">${d.memberId}</div>
                </div>
                <div>
                    <div class="inv-field-lbl">Date of Birth</div>
                    <div class="inv-field-val">${d.dob}</div>
                </div>
                <div>
                    <div class="inv-field-lbl">Facility Name</div>
                    <div class="inv-field-val">${d.facility}</div>
                </div>
                <div>
                    <div class="inv-field-lbl">Facility Tax ID</div>
                    <div class="inv-field-val mono">${d.taxId}</div>
                </div>
            </div>
        </div>

        <div class="section-header">
            <div class="section-title">Invoice Line Breakdown</div>
        </div>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Line</th>
                        <th>CPT Code</th>
                        <th>Description</th>
                        <th class="num-right">Billed</th>
                        <th class="num-right">Savings</th>
                        <th class="num-right">Allowed</th>
                    </tr>
                </thead>
                <tbody>${lineRows}</tbody>
                <tfoot>
                    <tr style="border-top:2px solid var(--surface-3)">
                        <td colspan="3" style="font-weight:700;color:var(--text-700);font-size:12.5px;text-transform:uppercase;letter-spacing:0.5px">Total</td>
                        <td class="mono num-right" style="font-weight:700">${usd(totBilled)}</td>
                        <td class="mono num-right" style="font-weight:700;color:var(--green)">${usd(totSavings)}</td>
                        <td class="mono num-right" style="font-weight:700;color:var(--navy)">${usd(totAllowed)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>`;
}

function renderSearchMember() {
    const d = MEMBER_MOCK;
    const initials = d.name.split(' ').filter((_,i,a) => i===0||i===a.length-1).map(w=>w[0]).join('');
    const statusColor = s => s === 'Settled' ? 'var(--green)' : s === 'Imported' ? '#b45309' : 'var(--text-500)';
    const rows = d.invoices.map(inv => `
        <tr>
            <td class="mono"><button class="uhap-link" data-uhap="${inv.uhap}">${inv.uhap}</button></td>
            <td class="mono" style="color:var(--text-500)">${inv.lineId}</td>
            <td class="mono num-right">${usd(inv.billed)}</td>
            <td class="mono num-right" style="color:var(--navy);font-weight:600">${usd(inv.allowed)}</td>
            <td>${inv.dos}</td>
            <td>${inv.facility}</td>
            <td style="font-weight:700;color:${statusColor(inv.status)}">${inv.status}</td>
        </tr>`).join('');

    return `<div class="view">
        <button class="srch-back-btn" id="srch-back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Search
        </button>

        <div class="member-overview">
            <div class="member-avatar-lg">${initials}</div>
            <div>
                <div class="member-overview-name">${d.name}</div>
                <div class="member-overview-meta">
                    <div class="member-overview-meta-item">Member ID &nbsp;<span>${d.memberId}</span></div>
                    <div class="member-overview-meta-item">Date of Birth &nbsp;<span>${d.dob}</span></div>
                </div>
                <div class="member-overview-meta" style="margin-top:4px">
                    <div class="member-overview-meta-item">Organization &nbsp;<span>${d.org}</span></div>
                </div>
            </div>
        </div>

        <div class="section-header">
            <div class="section-title">Invoices — ${d.invoices.length} records</div>
        </div>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>UHAP ID</th>
                        <th>Line ID</th>
                        <th class="num-right">Total Billed</th>
                        <th class="num-right">Total Allowed</th>
                        <th>Date of Service</th>
                        <th>Facility Name</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    </div>`;
}

// ===================================================
//  VIEW REGISTRY
// ===================================================

// ===================================================
//  WRONG MEMBER ID
// ===================================================

const WRONG_MEMBER_ID = [
    { memberName:'A. LINDQVIST',  memberId:'909000481203', dob:'1987-04-12', uhap:'14882301', desc:'Member ID Not Found'             },
    { memberName:'C. BERGSTRÖM',  memberId:'909000293847', dob:'1972-09-28', uhap:'14793045', desc:'Date of Birth Mismatch'          },
    { memberName:'I. SVENSSON',   memberId:'909000104729', dob:'1990-01-05', uhap:'14651872', desc:'Member ID Not Found'             },
    { memberName:'R. LARSEN',     memberId:'909000837461', dob:'1965-11-17', uhap:'14920384', desc:'Date of Birth Mismatch'          },
    { memberName:'P. HOLM',       memberId:'909000562038', dob:'1983-06-30', uhap:'14748293', desc:'Member ID Not Found'             },
    { memberName:'T. NIELSEN',    memberId:'909000391027', dob:'1978-03-22', uhap:'14837164', desc:'Member ID Not Found'             },
    { memberName:'W. MÄKINEN',    memberId:'909000714830', dob:'1995-08-09', uhap:'14562901', desc:'Date of Birth Mismatch'          },
    { memberName:'F. BERGSTRÖM',  memberId:'909000629471', dob:'1969-12-03', uhap:'14419083', desc:'Member ID Not Found'             },
    { memberName:'K. HALVORSEN',  memberId:'909000184503', dob:'1991-07-14', uhap:'14983720', desc:'Date of Birth Mismatch'          },
    { memberName:'M. ANDERSEN',   memberId:'909000473920', dob:'1974-02-26', uhap:'14271048', desc:'Member ID Not Found'             },
    { memberName:'H. JOHANSSON',  memberId:'909000852016', dob:'1988-10-11', uhap:'14508367', desc:'Date of Birth Mismatch'          },
    { memberName:'L. MAGNUSSON',  memberId:'909000231748', dob:'1962-05-19', uhap:'14694531', desc:'Member ID Not Found'             },
    { memberName:'S. ERIKSSON',   memberId:'909000967304', dob:'1997-03-07', uhap:'14372819', desc:'Date of Birth Mismatch'          },
    { memberName:'N. HAUGEN',     memberId:'909000548271', dob:'1980-08-24', uhap:'14815640', desc:'Member ID Not Found'             },
];

function renderWrongMemberId() {
    const rows = WRONG_MEMBER_ID.map(r => `
    <tr>
        <td>${r.memberName}</td>
        <td class="mono">${r.memberId}</td>
        <td class="mono">${r.dob}</td>
        <td class="mono">${r.uhap}</td>
        <td style="white-space:nowrap">${r.desc}</td>
        <td><input class="cell-input wide" type="text" placeholder="Comment…"></td>
        <td>
            <div class="action-group">
                <button class="btn btn-lime btn-sm btn-magnetic wm-update-btn"
                    data-name="${r.memberName}" data-id="${r.memberId}">Update</button>
                <button class="btn btn-danger btn-sm btn-magnetic wm-remove-btn"
                    data-name="${r.memberName}" data-id="${r.memberId}">Remove</button>
            </div>
        </td>
    </tr>`).join('');

    return `<div class="view">

        <!-- Confirm modal -->
        <div class="modal-backdrop" id="wm-confirm-backdrop">
            <div class="modal modal-sm">
                <div class="modal-header">
                    <span class="modal-title" id="wm-confirm-title">Confirm Action</span>
                    <button class="modal-close" id="wm-confirm-close" type="button">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div class="modal-body">
                    <p class="modal-confirm-text" id="wm-confirm-text"></p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-ghost btn-magnetic" id="wm-confirm-cancel">Cancel</button>
                    <button class="btn btn-lime btn-magnetic" id="wm-confirm-ok">Confirm</button>
                </div>
            </div>
        </div>

        <!-- Toast -->
        <div class="recovery-toast" id="wm-toast">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg>
            <span id="wm-toast-msg"></span>
        </div>

        <div class="view-hero">
            <div class="view-hero-left">
                <div class="view-hero-title">Wrong Member ID</div>
                <div class="view-hero-sub">Invoices rejected due to mismatched or invalid member identifiers</div>
            </div>
            <div class="view-hero-right">
                <div>
                    <div class="view-hero-count">14</div>
                    <div class="view-hero-count-lbl">Pending</div>
                </div>
            </div>
        </div>
        <div class="section-header">
            ${searchBar('Search member name, ID or UHAP ID…')}
            ${perPage()}
        </div>
        <div class="table-wrapper">
            <div class="table-scroll">
                <table>
                    <thead><tr>
                        ${th('Member Name')}
                        ${th('Member ID')}
                        ${th('Date of Birth')}
                        ${th('UHAP ID')}
                        ${th('Description', false)}
                        ${th('Comment', false)}
                        ${th('Actions', false)}
                    </tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            ${tableFooter(14, 14)}
        </div>
    </div>`;
}

// ===================================================
//  LINE COUNT / ORDER MISMATCHES DATA
// ===================================================

const LINE_MISMATCHES = [
    { uhap:'14827340', memberId:'909000481203', memberName:'A. LINDQVIST',  error:'Line Count Mismatch', original:4,  exported:3  },
    { uhap:'14793512', memberId:'909000293847', memberName:'C. BERGSTRÖM',  error:'Line Order Mismatch', original:null, exported:null },
    { uhap:'14651029', memberId:'909000104729', memberName:'I. SVENSSON',   error:'Line Count Mismatch', original:6,  exported:5  },
    { uhap:'14920748', memberId:'909000837461', memberName:'R. LARSEN',     error:'Line Order Mismatch', original:null, exported:null },
    { uhap:'14748901', memberId:'909000562038', memberName:'P. HOLM',       error:'Line Count Mismatch', original:3,  exported:1  },
    { uhap:'14837523', memberId:'909000391027', memberName:'T. NIELSEN',    error:'Line Count Mismatch', original:5,  exported:4  },
    { uhap:'14562184', memberId:'909000714830', memberName:'W. MÄKINEN',    error:'Line Order Mismatch', original:null, exported:null },
    { uhap:'14419267', memberId:'909000629471', memberName:'F. BERGSTRÖM',  error:'Line Count Mismatch', original:7,  exported:6  },
    { uhap:'14983045', memberId:'909000184503', memberName:'K. HALVORSEN',  error:'Line Order Mismatch', original:null, exported:null },
    { uhap:'14271390', memberId:'909000473920', memberName:'M. ANDERSEN',   error:'Line Count Mismatch', original:4,  exported:2  },
    { uhap:'14508612', memberId:'909000852016', memberName:'H. JOHANSSON',  error:'Line Count Mismatch', original:8,  exported:7  },
    { uhap:'14694873', memberId:'909000231748', memberName:'L. MAGNUSSON',  error:'Line Order Mismatch', original:null, exported:null },
    { uhap:'14372056', memberId:'909000967304', memberName:'S. ERIKSSON',   error:'Line Count Mismatch', original:5,  exported:3  },
    { uhap:'14815904', memberId:'909000548271', memberName:'N. HAUGEN',     error:'Line Order Mismatch', original:null, exported:null },
    { uhap:'14660431', memberId:'909000712049', memberName:'O. LUND',       error:'Line Count Mismatch', original:6,  exported:4  },
    { uhap:'14531278', memberId:'909000385612', memberName:'G. THORSEN',    error:'Line Count Mismatch', original:3,  exported:2  },
    { uhap:'14209867', memberId:'909000641893', memberName:'B. DAHL',       error:'Line Order Mismatch', original:null, exported:null },
    { uhap:'14748023', memberId:'909000920374', memberName:'U. JANSSON',    error:'Line Count Mismatch', original:9,  exported:8  },
];

function renderLineMismatches() {
    const rows = LINE_MISMATCHES.map(r => {
        const errDetail = r.error === 'Line Count Mismatch'
            ? `Line Count Mismatch &mdash; Original: <span class="modal-confirm-code" style="font-size:11px">${r.original}</span> &nbsp;Exported: <span class="modal-confirm-code" style="font-size:11px">${r.exported}</span>`
            : `Line Order Mismatch`;
        return `<tr>
        <td class="mono">${r.uhap}</td>
        <td class="mono">${r.memberId}</td>
        <td>${r.memberName}</td>
        <td><span class="error-badge">${r.error}</span><span class="lm-err-detail" style="display:block;font-size:11px;color:var(--text-400);margin-top:2px">${errDetail}</span></td>
        <td><input class="cell-input wide lm-new-id-input" type="text" placeholder="Enter new ID…"></td>
        <td>
            <div class="action-group">
                <button class="btn btn-lime btn-sm btn-magnetic lm-update-btn"
                    data-uhap="${r.uhap}" data-name="${r.memberName}" data-member="${r.memberId}">Update</button>
                <button class="btn btn-danger btn-sm btn-magnetic lm-remove-btn"
                    data-uhap="${r.uhap}" data-name="${r.memberName}" data-member="${r.memberId}">Remove</button>
            </div>
        </td>
    </tr>`;
    }).join('');

    return `<div class="view">

        <!-- Confirm modal -->
        <div class="modal-backdrop" id="lm-confirm-backdrop">
            <div class="modal modal-sm">
                <div class="modal-header">
                    <span class="modal-title" id="lm-confirm-title">Confirm Action</span>
                    <button class="modal-close" id="lm-confirm-close" type="button">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div class="modal-body">
                    <p class="modal-confirm-text" id="lm-confirm-text"></p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-ghost btn-magnetic" id="lm-confirm-cancel">Cancel</button>
                    <button class="btn btn-lime btn-magnetic" id="lm-confirm-ok">Confirm</button>
                </div>
            </div>
        </div>

        <!-- Toast -->
        <div class="recovery-toast" id="lm-toast">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg>
            <span id="lm-toast-msg"></span>
        </div>

        <div class="view-hero">
            <div class="view-hero-left">
                <div class="view-hero-title">Line Count / Order Mismatches</div>
                <div class="view-hero-sub">Invoices rejected due to line count or ordering discrepancies in export</div>
            </div>
            <div class="view-hero-right">
                <div>
                    <div class="view-hero-count">18</div>
                    <div class="view-hero-count-lbl">Pending</div>
                </div>
            </div>
        </div>
        <div class="section-header">
            ${searchBar('Search UHAP ID, member ID or name…')}
            ${perPage()}
        </div>
        <div class="table-wrapper">
            <div class="table-scroll">
                <table>
                    <thead><tr>
                        ${th('UHAP ID')}
                        ${th('Member ID')}
                        ${th('Member Name')}
                        ${th('Error', false)}
                        ${th('New ID', false)}
                        ${th('Actions', false)}
                    </tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            ${tableFooter(18, 18)}
        </div>
    </div>`;
}

// Fee Invoice: insurance company names per org id
const FEE_INVOICE_NAMES = {
    '007-001': 'Gjensidige Forsikring',
    '008-005': 'If P&C Insurance',
    '100-001': 'Allianz SE',
    '143-001': 'AXA Group',
    '190-001': 'Zurich Insurance Group',
    '081-001': 'Generali Group',
    '060-026': 'Vienna Insurance Group',
    '008-010': 'Tryg Forsikring',
    '178-001': 'Folksam Group',
};

// Automation state per org id (true = enabled)
const FEE_INVOICE_AUTO = {
    '007-001': true,
    '008-005': false,
    '100-001': true,
    '143-001': false,
    '190-001': false,
    '081-001': true,
    '060-026': false,
    '008-010': false,
    '178-001': true,
};

function renderFeeInvoice() {
    const rows = ORGANIZATIONS.map(o => {
        const enabled  = FEE_INVOICE_AUTO[o.id] || false;
        const insName  = FEE_INVOICE_NAMES[o.id] || o.name;
        const offCls   = enabled ? '' : ' fi-row-off';
        return `<tr class="${offCls.trim()}" data-org-id="${o.id}">
        <td>
            <div style="font-weight:500;color:var(--text-100)">${insName}</div>
            <div style="font-size:11px;color:var(--text-400);margin-top:2px">${o.id}</div>
        </td>
        <td style="width:160px;text-align:center">
            <label class="fi-toggle" title="${enabled ? 'Automation enabled' : 'Automation disabled'}">
                <input type="checkbox" class="fi-auto-chk"${enabled ? ' checked' : ''}
                    data-org-id="${o.id}" data-org-name="${insName}">
                <span class="fi-toggle-track"></span>
            </label>
        </td>
    </tr>`;
    }).join('');

    return `<div class="view">

        <!-- Confirm modal -->
        <div class="modal-backdrop" id="fi-confirm-backdrop">
            <div class="modal modal-sm">
                <div class="modal-header">
                    <span class="modal-title">Confirm Automation Change</span>
                    <button class="modal-close" id="fi-confirm-close" type="button">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div class="modal-body">
                    <p class="modal-confirm-text" id="fi-confirm-text"></p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-ghost btn-magnetic" id="fi-confirm-cancel">Cancel</button>
                    <button class="btn btn-lime btn-magnetic" id="fi-confirm-ok">Yes, Apply</button>
                </div>
            </div>
        </div>

        <!-- Toast -->
        <div class="recovery-toast" id="fi-toast">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg>
            <span id="fi-toast-msg"></span>
        </div>

        <div class="view-hero">
            <div class="view-hero-left">
                <div class="view-hero-title">Fee Invoice Automation</div>
                <div class="view-hero-sub">Configure invoice fee generation automation per registered insurance company</div>
            </div>
            <div class="view-hero-right">
                <div>
                    <div class="view-hero-count">${ORGANIZATIONS.length}</div>
                    <div class="view-hero-count-lbl">Insurances</div>
                </div>
            </div>
        </div>
        <div class="section-header">
            ${searchBar('Search insurance company name…', `
                <label class="fi-active-filter">
                    <input type="checkbox" id="fi-active-only">
                    <span class="fi-active-filter-track"></span>
                    <span class="fi-active-filter-label">Show active only</span>
                </label>
            `)}
            ${perPage()}
        </div>
        <div class="table-wrapper">
            <div class="table-scroll">
                <table>
                    <thead><tr>
                        ${th('Insurance Company')}
                        <th style="width:160px;text-align:center">Automation</th>
                    </tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            ${tableFooter(ORGANIZATIONS.length, ORGANIZATIONS.length)}
        </div>
    </div>`;
}

const VIEWS = {
    'landing':          { title: '',                     breadcrumb: '',           render: renderLanding          },
    'missing-claims':   { title: 'Missing Claims',       breadcrumb: 'Claims',     render: renderMissingClaims    },
    'missing-gop':      { title: 'Missing GOP',          breadcrumb: 'Claims',     render: renderMissingGOP       },
    'reupload-invoices':{ title: 'Reupload Invoices',    breadcrumb: 'Claims',     render: renderReuploadInvoices },
    'manual-handling':  { title: 'Manual Handling',      breadcrumb: 'Claims',     render: renderManualHandling   },
    'recovery-request': { title: 'Recovery Request',     breadcrumb: 'Management', render: renderRecoveryRequest  },
    'cpt-mapping':      { title: 'CPT Code Mapping',     breadcrumb: 'Management', render: renderCPTMapping       },
    'org-manager':      { title: 'Organization Manager',    breadcrumb: 'Management', render: renderOrgManager       },
    'wrong-member-id':  { title: 'Wrong Member ID',         breadcrumb: 'Management', render: renderWrongMemberId    },
    'line-mismatches':  { title: 'Line Count / Order Mismatches', breadcrumb: 'Management', render: renderLineMismatches },
    'fee-invoice':      { title: 'Fee Invoice',                   breadcrumb: 'Management', render: renderFeeInvoice     },
    'ext-auth':         { title: 'External Coverage Queue',  breadcrumb: 'Claims',     render: renderExtAuth          },
    'all-entries':      { title: 'All Entries',             breadcrumb: 'Records',    render: renderAllEntries       },
    'search-uhap':      { title: 'Invoice Lookup',          breadcrumb: 'Search',     render: renderSearchUhap       },
    'search-member':    { title: 'Member Invoices',         breadcrumb: 'Search',     render: renderSearchMember     },
};

// ===================================================
//  NAVIGATION
// ===================================================

let currentView = 'landing';

function navigate(viewId) {
    if (!VIEWS[viewId]) return;
    if (viewId === currentView && viewId !== 'landing') return;
    currentView = viewId;
    const isLanding = viewId === 'landing';

    document.body.classList.toggle('landing-mode', isLanding);

    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', el.dataset.view === viewId);
    });

    if (!isLanding) {
        const def = VIEWS[viewId];
        document.getElementById('view-title').textContent = def.title;
        document.getElementById('view-breadcrumb').textContent = def.breadcrumb;
    }

    const content = document.getElementById('content-area');
    content.scrollTop = 0;
    content.innerHTML = VIEWS[viewId].render();
    attachInteractions();
}

// ===================================================
//  INTERACTIONS
// ===================================================

function attachInteractions() {
    // Magnetic buttons
    document.querySelectorAll('.btn-magnetic').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width  / 2) * 0.18;
            const y = (e.clientY - r.top  - r.height / 2) * 0.18;
            btn.style.transform = `translate(${x}px, ${y}px) translateY(-1px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });

    // Per-page toggle
    document.querySelectorAll('.per-page-group').forEach(group => {
        group.querySelectorAll('.per-page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                group.querySelectorAll('.per-page-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    });

    // Sortable column headers
    document.querySelectorAll('th').forEach(thEl => {
        if (!thEl.querySelector('.sort-icon')) return;
        thEl.addEventListener('click', () => {
            thEl.closest('table').querySelectorAll('th').forEach(t => {
                if (t !== thEl) t.classList.remove('sorted-asc','sorted-desc');
            });
            if (thEl.classList.contains('sorted-asc'))       thEl.classList.replace('sorted-asc','sorted-desc');
            else if (thEl.classList.contains('sorted-desc')) thEl.classList.remove('sorted-desc');
            else                                              thEl.classList.add('sorted-asc');
        });
    });

    // Landing page card navigation
    document.querySelectorAll('.landing-card[data-view], .landing-stat-card[data-view]').forEach(card => {
        card.addEventListener('click', () => navigate(card.dataset.view));
    });

    // Search Invoice widget — custom dropdown
    const searchInput  = document.getElementById('invoice-search-input');
    const searchBtn    = document.getElementById('invoice-search-btn');
    const typeDropdown = document.getElementById('invoice-type-dropdown');
    const typeBtn      = document.getElementById('invoice-type-btn');
    const typeText     = document.getElementById('invoice-type-text');
    const typeMenu     = document.getElementById('invoice-type-menu');
    if (typeBtn && typeMenu) {
        typeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            typeDropdown.classList.toggle('open');
        });
        typeMenu.querySelectorAll('.landing-srch-opt').forEach(opt => {
            opt.addEventListener('click', () => {
                typeMenu.querySelectorAll('.landing-srch-opt').forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                typeText.textContent = opt.textContent;
                typeDropdown.classList.remove('open');
                searchInput.placeholder = opt.dataset.type === 'uhap'
                    ? 'Enter UHAP Claim ID…'
                    : 'Enter Member ID…';
                searchInput.value = '';
                searchInput.focus();
            });
        });
        document.addEventListener('click', () => typeDropdown.classList.remove('open'));
    }

    // CPT Mapping modal
    const cptAddBtn    = document.getElementById('cpt-add-btn');
    const cptBackdrop  = document.getElementById('cpt-modal-backdrop');
    const cptClose     = document.getElementById('cpt-modal-close');
    const cptCancel    = document.getElementById('cpt-modal-cancel');
    const cptSubmit    = document.getElementById('cpt-modal-submit');
    const cptFileInput = document.getElementById('cpt-file-input');
    const cptUploadTxt = document.getElementById('cpt-upload-text');
    if (cptAddBtn && cptBackdrop) {
        const modalTitle = cptBackdrop.querySelector('.modal-title');
        const cptCodeInput = document.getElementById('cpt-input-code');
        const cptDescInput = document.getElementById('cpt-input-desc');
        const modalImport = cptBackdrop.querySelector('.modal-divider');
        const modalUpload = cptBackdrop.querySelector('.modal-upload-btn');
        const openModal = (cpt = '', desc = '') => {
            const isEdit = !!cpt;
            modalTitle.textContent = isEdit ? 'Edit CPT Mapping' : 'Add CPT Mapping';
            cptCodeInput.value = cpt;
            cptDescInput.value = desc;
            if (cptFileInput) cptFileInput.value = '';
            if (cptUploadTxt) cptUploadTxt.textContent = 'Import Excel file (.xlsx)';
            modalImport.style.display = isEdit ? 'none' : '';
            modalUpload.style.display = isEdit ? 'none' : '';
            cptBackdrop.classList.add('open');
            (isEdit ? cptDescInput : cptCodeInput).focus();
        };
        const closeModal = () => cptBackdrop.classList.remove('open');
        cptAddBtn.addEventListener('click', () => openModal());
        cptClose.addEventListener('click', closeModal);
        cptCancel.addEventListener('click', closeModal);
        cptBackdrop.addEventListener('click', e => { if (e.target === cptBackdrop) closeModal(); });
        cptFileInput.addEventListener('change', () => {
            const f = cptFileInput.files[0];
            if (f) cptUploadTxt.textContent = f.name;
        });
        cptSubmit.addEventListener('click', closeModal);
        document.querySelectorAll('.cpt-edit-btn').forEach(btn => {
            btn.addEventListener('click', () => openModal(btn.dataset.cpt, btn.dataset.desc));
        });
    }

    // CPT delete confirm modal
    const confirmBackdrop = document.getElementById('cpt-confirm-backdrop');
    const confirmClose    = document.getElementById('cpt-confirm-close');
    const confirmCancel   = document.getElementById('cpt-confirm-cancel');
    const confirmDelete   = document.getElementById('cpt-confirm-delete');
    const confirmCode     = document.getElementById('cpt-confirm-code');
    if (confirmBackdrop) {
        const closeConfirm = () => confirmBackdrop.classList.remove('open');
        document.querySelectorAll('.cpt-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                confirmCode.textContent = btn.dataset.cpt;
                confirmBackdrop.classList.add('open');
            });
        });
        confirmClose.addEventListener('click', closeConfirm);
        confirmCancel.addEventListener('click', closeConfirm);
        confirmBackdrop.addEventListener('click', e => { if (e.target === confirmBackdrop) closeConfirm(); });
        confirmDelete.addEventListener('click', closeConfirm);
    }

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const val = searchInput.value.trim();
            if (!val) { searchInput.focus(); return; }
            _srchQuery = val;
            const activeOpt = document.querySelector('.landing-srch-opt.active');
            _srchType = activeOpt ? activeOpt.dataset.type : 'uhap';
            navigate(_srchType === 'member' ? 'search-member' : 'search-uhap');
        });
        searchInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') searchBtn.click();
        });
    }

    // Search result — back button
    const srchBackBtn = document.getElementById('srch-back-btn');
    if (srchBackBtn) {
        srchBackBtn.addEventListener('click', () => navigate('landing'));
    }

    // Member invoices — clickable UHAP ID rows
    document.querySelectorAll('.uhap-link').forEach(btn => {
        btn.addEventListener('click', () => {
            _srchQuery = btn.dataset.uhap;
            _srchType  = 'uhap';
            navigate('search-uhap');
        });
    });

    // External Coverage Queue — CC emails
    const cqCCBackdrop = document.getElementById('cq-cc-backdrop');
    const cqCCInput    = document.getElementById('cq-cc-input');
    const cqCCSave     = document.getElementById('cq-cc-save');
    const cqCCEmails   = {};  // keyed by clientId → string[]
    let   _cqCCMember  = null;

    function parseCCEmails(raw) {
        return raw.split(';').map(e => e.trim()).filter(e => e.length > 0);
    }
    function renderCCChips(clientId) {
        const emails = cqCCEmails[clientId] || [];
        const html   = emails.map(e =>
            `<span class="cq-cc-chip" data-email="${e}">` +
            `${e}<button class="cq-cc-chip-remove" title="Remove" data-member="${clientId}" data-email="${e}">&times;</button>` +
            `</span>`
        ).join('');
        document.querySelectorAll(`.cq-cc-chips-wrap[data-member="${clientId}"]`).forEach(w => { w.innerHTML = html; });
    }

    document.addEventListener('click', e => {
        const rmBtn = e.target.closest('.cq-cc-chip-remove');
        if (!rmBtn) return;
        const clientId = rmBtn.dataset.member;
        const email    = rmBtn.dataset.email;
        if (cqCCEmails[clientId]) {
            cqCCEmails[clientId] = cqCCEmails[clientId].filter(em => em !== email);
            if (cqCCEmails[clientId].length === 0) delete cqCCEmails[clientId];
        }
        renderCCChips(clientId);
    });

    if (cqCCBackdrop) {
        const closeCCModal = () => { cqCCBackdrop.classList.remove('open'); cqCCInput.value = ''; cqCCSave.disabled = true; };
        document.getElementById('cq-cc-close').addEventListener('click', closeCCModal);
        document.getElementById('cq-cc-cancel').addEventListener('click', closeCCModal);
        cqCCBackdrop.addEventListener('click', e => { if (e.target === cqCCBackdrop) closeCCModal(); });
        cqCCInput.addEventListener('input', () => { cqCCSave.disabled = cqCCInput.value.trim().length === 0; });
        cqCCSave.addEventListener('click', () => {
            const emails = parseCCEmails(cqCCInput.value);
            if (emails.length === 0) return;
            cqCCEmails[_cqCCMember] = emails;
            renderCCChips(_cqCCMember);
            closeCCModal();
        });
        document.addEventListener('click', e => {
            const btn = e.target.closest('.cq-cc-btn');
            if (!btn) return;
            _cqCCMember = btn.dataset.member;
            cqCCInput.value = (cqCCEmails[_cqCCMember] || []).join('; ');
            cqCCSave.disabled = cqCCInput.value.trim().length === 0;
            cqCCBackdrop.classList.add('open');
            setTimeout(() => cqCCInput.focus(), 80);
        });
    }

    // External Coverage Queue — checkbox selection + send flow
    const cqTable      = document.getElementById('cq-table');
    const cqSendBtn    = document.getElementById('cq-send-btn');
    const cqWarning    = document.getElementById('cq-warning');
    const cqBackdrop   = document.getElementById('cq-send-backdrop');
    const cqToast      = document.getElementById('cq-toast');
    const cqToastMsg   = document.getElementById('cq-toast-msg');
    if (cqTable && cqSendBtn) {
        let _cqToastTimer = null;

        const showCqToast = (msg) => {
            cqToastMsg.textContent = msg;
            cqToast.classList.add('show');
            clearTimeout(_cqToastTimer);
            _cqToastTimer = setTimeout(() => cqToast.classList.remove('show'), 4500);
        };

        const updateCqState = () => {
            const checked = [...cqTable.querySelectorAll('.cq-check:checked')];
            const memberIds = new Set(checked.map(c => c.dataset.member));
            if (checked.length === 0) {
                cqSendBtn.disabled = true;
                cqWarning.style.display = 'none';
            } else if (memberIds.size > 1) {
                cqSendBtn.disabled = true;
                cqWarning.style.display = 'flex';
            } else {
                cqSendBtn.disabled = false;
                cqWarning.style.display = 'none';
            }
        };

        cqTable.addEventListener('change', e => {
            if (e.target.classList.contains('cq-check')) updateCqState();
        });

        cqTable.addEventListener('click', e => {
            const btn = e.target.closest('.cq-select-all-btn');
            if (!btn) return;
            const memberId = btn.dataset.member;
            const checks = [...cqTable.querySelectorAll(`.cq-check[data-member="${memberId}"]`)];
            const allChecked = checks.every(c => c.checked);
            checks.forEach(c => { c.checked = !allChecked; });
            btn.textContent = allChecked ? 'Select All' : 'Deselect All';
            updateCqState();
        });

        cqSendBtn.addEventListener('click', () => {
            const checked = [...cqTable.querySelectorAll('.cq-check:checked')];
            const first = checked[0];
            const memberId   = first.dataset.member;
            const memberName = name(memberId);
            const email      = first.dataset.email;

            document.getElementById('cq-modal-member-line').innerHTML =
                `Coverage request for <span class="modal-confirm-code">${memberName}</span> &mdash; Member ID <span class="modal-confirm-code">${memberId}</span>`;
            document.getElementById('cq-modal-email').textContent = email;
            const ccList = cqCCEmails[memberId] || [];
            const ccRow  = document.getElementById('cq-modal-cc-row');
            const ccChips = document.getElementById('cq-modal-cc-chips');
            if (ccList.length > 0) {
                ccChips.innerHTML = ccList.map(e => `<span class="cq-cc-chip">${e}</span>`).join('');
                ccRow.style.display = 'flex';
            } else {
                ccRow.style.display = 'none';
            }
            document.getElementById('cq-modal-invoices').innerHTML = checked.map(c => `
                <div class="cq-modal-invoice-item">
                    <span class="mono" style="color:var(--lime)">${c.dataset.uhap}</span>
                    <span>${c.dataset.date}</span>
                    <span style="white-space:normal;flex:1">${c.dataset.facility}</span>
                    <span class="diag-code" style="font-size:11px">${c.dataset.diag}</span>
                    <span class="mono" style="font-weight:600">${usd(c.dataset.amount)}</span>
                </div>`).join('');
            cqBackdrop.classList.add('open');
        });

        const closeCqModal = () => cqBackdrop.classList.remove('open');
        document.getElementById('cq-send-close').addEventListener('click', closeCqModal);
        document.getElementById('cq-send-cancel').addEventListener('click', closeCqModal);
        cqBackdrop.addEventListener('click', e => { if (e.target === cqBackdrop) closeCqModal(); });

        document.getElementById('cq-send-confirm').addEventListener('click', () => {
            const email = document.getElementById('cq-modal-email').textContent;
            const checkedRows = [...cqTable.querySelectorAll('.cq-check:checked')].map(c => c.closest('tr'));
            const count = checkedRows.length;
            closeCqModal();
            showCqToast(`Coverage request sent to ${email} — ${count} invoice${count > 1 ? 's' : ''} dispatched.`);
            checkedRows.forEach(tr => {
                tr.classList.add('row-removing');
                tr.addEventListener('transitionend', () => tr.remove(), { once: true });
            });
            updateCqState();
        });
    }

    // Recovery Request — Start Recovery flow
    const recConfirmBackdrop = document.getElementById('rec-confirm-backdrop');
    const recToast           = document.getElementById('rec-toast');
    const recToastMsg        = document.getElementById('rec-toast-msg');
    if (recConfirmBackdrop) {
        const confirmText = document.getElementById('rec-confirm-text');
        let _recUhap = '', _recAmount = '', _recReason = '';
        let _toastTimer = null;

        const closeConfirm = () => recConfirmBackdrop.classList.remove('open');
        const showToast = (msg) => {
            recToastMsg.textContent = msg;
            recToast.classList.add('show');
            clearTimeout(_toastTimer);
            _toastTimer = setTimeout(() => recToast.classList.remove('show'), 4000);
        };

        // Enable Start Recovery when a denial reason is selected
        document.querySelectorAll('.rec-denial-select').forEach(sel => {
            sel.addEventListener('change', () => {
                const btn = sel.closest('tr').querySelector('.rec-start-btn');
                btn.disabled = !sel.value;
            });
        });

        // Open confirm modal directly from row button
        document.querySelectorAll('.rec-start-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tr   = btn.closest('tr');
                _recUhap   = btn.dataset.uhap;
                _recAmount = btn.dataset.amount;
                _recReason = tr.querySelector('.rec-denial-select').value;
                confirmText.innerHTML = `Start recovery for invoice <span class="modal-confirm-code">${_recUhap}</span> — amount <span class="modal-confirm-code">${usd(_recAmount)}</span>?<br><br>Denial reason: <em style="color:rgba(255,255,255,0.8)">${_recReason}</em>`;
                recConfirmBackdrop.classList.add('open');
            });
        });

        document.getElementById('rec-confirm-close').addEventListener('click', closeConfirm);
        document.getElementById('rec-confirm-cancel').addEventListener('click', closeConfirm);
        recConfirmBackdrop.addEventListener('click', e => { if (e.target === recConfirmBackdrop) closeConfirm(); });

        document.getElementById('rec-confirm-ok').addEventListener('click', () => {
            closeConfirm();
            showToast(`Recovery initiated for invoice ${_recUhap} — ${usd(_recAmount)}.`);
        });
    }

    // Wrong Member ID — two-step Update / Remove
    const wmBackdrop   = document.getElementById('wm-confirm-backdrop');
    const wmToast      = document.getElementById('wm-toast');
    const wmToastMsg   = document.getElementById('wm-toast-msg');
    if (wmBackdrop) {
        let _wmAction = '', _wmName = '', _wmId = '', _wmPendingRow = null;
        let _wmTimer  = null;

        const wmClose = () => wmBackdrop.classList.remove('open');
        const wmShowToast = (msg) => {
            wmToastMsg.textContent = msg;
            wmToast.classList.add('show');
            clearTimeout(_wmTimer);
            _wmTimer = setTimeout(() => wmToast.classList.remove('show'), 4000);
        };

        const wmConfirmOk  = document.getElementById('wm-confirm-ok');
        const wmConfirmTitle = document.getElementById('wm-confirm-title');
        const wmConfirmText  = document.getElementById('wm-confirm-text');

        document.querySelectorAll('.wm-update-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                _wmAction     = 'update';
                _wmName       = btn.dataset.name;
                _wmId         = btn.dataset.id;
                _wmPendingRow = btn.closest('tr');
                wmConfirmTitle.textContent = 'Confirm Update';
                wmConfirmText.innerHTML = `Update record for <span class="modal-confirm-code">${_wmName}</span> (ID: <span class="modal-confirm-code">${_wmId}</span>)?`;
                wmConfirmOk.className = 'btn btn-lime btn-magnetic';
                wmConfirmOk.textContent = 'Confirm';
                wmBackdrop.classList.add('open');
            });
        });

        document.querySelectorAll('.wm-remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                _wmAction     = 'remove';
                _wmName       = btn.dataset.name;
                _wmId         = btn.dataset.id;
                _wmPendingRow = btn.closest('tr');
                wmConfirmTitle.textContent = 'Confirm Removal';
                wmConfirmText.innerHTML = `Remove record for <span class="modal-confirm-code">${_wmName}</span> (ID: <span class="modal-confirm-code">${_wmId}</span>)? This action cannot be undone.`;
                wmConfirmOk.className = 'btn btn-danger btn-magnetic';
                wmConfirmOk.textContent = 'Remove';
                wmBackdrop.classList.add('open');
            });
        });

        document.getElementById('wm-confirm-close').addEventListener('click', wmClose);
        document.getElementById('wm-confirm-cancel').addEventListener('click', wmClose);
        wmBackdrop.addEventListener('click', e => { if (e.target === wmBackdrop) wmClose(); });

        wmConfirmOk.addEventListener('click', () => {
            wmClose();
            if (_wmAction === 'update') {
                wmShowToast(`Record updated for ${_wmName} — member ID ${_wmId}.`);
            } else {
                wmShowToast(`Record removed for ${_wmName} — member ID ${_wmId}.`);
            }
            if (_wmPendingRow) {
                _wmPendingRow.classList.add('row-removing');
                _wmPendingRow.addEventListener('transitionend', () => _wmPendingRow.remove(), { once: true });
            }
        });
    }

    // Line Count / Order Mismatches — two-step Update / Remove
    const lmBackdrop = document.getElementById('lm-confirm-backdrop');
    const lmToast    = document.getElementById('lm-toast');
    const lmToastMsg = document.getElementById('lm-toast-msg');
    if (lmBackdrop) {
        let _lmAction = '', _lmUhap = '', _lmName = '', _lmPendingRow = null;
        let _lmTimer  = null;

        const lmClose = () => lmBackdrop.classList.remove('open');
        const lmShowToast = (msg) => {
            lmToastMsg.textContent = msg;
            lmToast.classList.add('show');
            clearTimeout(_lmTimer);
            _lmTimer = setTimeout(() => lmToast.classList.remove('show'), 4000);
        };

        const lmConfirmOk    = document.getElementById('lm-confirm-ok');
        const lmConfirmTitle = document.getElementById('lm-confirm-title');
        const lmConfirmText  = document.getElementById('lm-confirm-text');

        document.querySelectorAll('.lm-update-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                _lmAction     = 'update';
                _lmUhap       = btn.dataset.uhap;
                _lmName       = btn.dataset.name;
                _lmPendingRow = btn.closest('tr');
                const newId   = (_lmPendingRow.querySelector('.lm-new-id-input') || {}).value || '';
                lmConfirmTitle.textContent = 'Confirm Update';
                lmConfirmText.innerHTML = newId
                    ? `Update UHAP ID <span class="modal-confirm-code">${_lmUhap}</span> for <span class="modal-confirm-code">${_lmName}</span> with new ID <span class="modal-confirm-code">${newId}</span>?`
                    : `Update UHAP ID <span class="modal-confirm-code">${_lmUhap}</span> for <span class="modal-confirm-code">${_lmName}</span>? <span style="color:rgba(255,200,50,0.85);font-size:12px">(No new ID entered)</span>`;
                lmConfirmOk.className    = 'btn btn-lime btn-magnetic';
                lmConfirmOk.textContent  = 'Confirm';
                lmBackdrop.classList.add('open');
            });
        });

        document.querySelectorAll('.lm-remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                _lmAction     = 'remove';
                _lmUhap       = btn.dataset.uhap;
                _lmName       = btn.dataset.name;
                _lmPendingRow = btn.closest('tr');
                lmConfirmTitle.textContent = 'Confirm Removal';
                lmConfirmText.innerHTML = `Remove mismatch record for <span class="modal-confirm-code">${_lmName}</span> (UHAP <span class="modal-confirm-code">${_lmUhap}</span>)? This action cannot be undone.`;
                lmConfirmOk.className   = 'btn btn-danger btn-magnetic';
                lmConfirmOk.textContent = 'Remove';
                lmBackdrop.classList.add('open');
            });
        });

        document.getElementById('lm-confirm-close').addEventListener('click', lmClose);
        document.getElementById('lm-confirm-cancel').addEventListener('click', lmClose);
        lmBackdrop.addEventListener('click', e => { if (e.target === lmBackdrop) lmClose(); });

        lmConfirmOk.addEventListener('click', () => {
            lmClose();
            if (_lmAction === 'update') {
                lmShowToast(`Record updated for ${_lmName} — UHAP ID ${_lmUhap}.`);
            } else {
                lmShowToast(`Record removed for ${_lmName} — UHAP ID ${_lmUhap}.`);
            }
            if (_lmPendingRow) {
                _lmPendingRow.classList.add('row-removing');
                _lmPendingRow.addEventListener('transitionend', () => _lmPendingRow.remove(), { once: true });
            }
        });
    }

    // Fee Invoice — toggle click triggers confirmation modal
    const fiBackdrop = document.getElementById('fi-confirm-backdrop');
    const fiToast    = document.getElementById('fi-toast');
    const fiToastMsg = document.getElementById('fi-toast-msg');
    if (fiBackdrop) {
        let _fiOrgName = '', _fiChk = null, _fiRow = null;
        let _fiTimer   = null;

        const fiClose = () => fiBackdrop.classList.remove('open');
        const fiShowToast = (msg) => {
            fiToastMsg.textContent = msg;
            fiToast.classList.add('show');
            clearTimeout(_fiTimer);
            _fiTimer = setTimeout(() => fiToast.classList.remove('show'), 4000);
        };

        const fiConfirmText = document.getElementById('fi-confirm-text');

        // Intercept checkbox change — show modal instead of toggling immediately
        document.querySelectorAll('.fi-auto-chk').forEach(chk => {
            chk.addEventListener('change', e => {
                e.preventDefault();
                // Revert the visual change — we'll apply it on confirm
                chk.checked = !chk.checked;
                _fiChk     = chk;
                _fiOrgName = chk.dataset.orgName;
                _fiRow     = chk.closest('tr');
                // _fiEnable = what the user WANTS (opposite of current state)
                const wantEnable = !chk.checked;
                const action     = wantEnable ? 'enable' : 'disable';
                fiConfirmText.innerHTML =
                    `Are you sure you wish to <strong>${action}</strong> invoice generation automation for <span class="modal-confirm-code">${_fiOrgName}</span>?`;
                fiBackdrop.classList.add('open');
            });
        });

        document.getElementById('fi-confirm-close').addEventListener('click', fiClose);
        document.getElementById('fi-confirm-cancel').addEventListener('click', fiClose);
        fiBackdrop.addEventListener('click', e => { if (e.target === fiBackdrop) fiClose(); });

        document.getElementById('fi-confirm-ok').addEventListener('click', () => {
            fiClose();
            if (_fiChk) {
                _fiChk.checked = !_fiChk.checked;
                const nowEnabled = _fiChk.checked;
                if (_fiRow) _fiRow.classList.toggle('fi-row-off', !nowEnabled);
                const action = nowEnabled ? 'enabled' : 'disabled';
                fiShowToast(`Invoice generation automation ${action} for ${_fiOrgName}.`);
                // Re-apply active-only filter if it's on
                const activeChk = document.getElementById('fi-active-only');
                if (activeChk && activeChk.checked && !nowEnabled) fiHideRow(_fiRow);
            }
        });
    }

    // Fee Invoice — "Show active only" filter
    const fiActiveChk = document.getElementById('fi-active-only');
    if (fiActiveChk) {
        function fiHideRow(tr) {
            tr.style.transition = 'opacity 200ms ease';
            tr.style.opacity    = '0';
            setTimeout(() => { tr.style.display = 'none'; tr.style.opacity = ''; }, 210);
        }
        function fiShowRow(tr) {
            tr.style.display    = '';
            tr.style.opacity    = '0';
            tr.style.transition = 'opacity 200ms ease';
            requestAnimationFrame(() => requestAnimationFrame(() => { tr.style.opacity = '1'; }));
        }
        fiActiveChk.addEventListener('change', () => {
            document.querySelectorAll('tr.fi-row-off').forEach(tr => {
                fiActiveChk.checked ? fiHideRow(tr) : fiShowRow(tr);
            });
        });
    }

    // ── Generic two-step helper ────────────────────────────────────────────
    function removeRow(btn) {
        const tr = btn.closest('tr');
        if (!tr) return;
        tr.classList.add('row-removing');
        tr.addEventListener('transitionend', () => tr.remove(), { once: true });
    }

    function setupTwoStep(prefix, handlers) {
        const backdrop = document.getElementById(`${prefix}-confirm-backdrop`);
        if (!backdrop) return;
        const toast     = document.getElementById(`${prefix}-toast`);
        const toastMsg  = document.getElementById(`${prefix}-toast-msg`);
        const title     = document.getElementById(`${prefix}-confirm-title`);
        const text      = document.getElementById(`${prefix}-confirm-text`);
        const okBtn     = document.getElementById(`${prefix}-confirm-ok`);
        let _timer = null;
        const close = () => backdrop.classList.remove('open');
        const showToast = (msg) => {
            toastMsg.textContent = msg;
            toast.classList.add('show');
            clearTimeout(_timer);
            _timer = setTimeout(() => toast.classList.remove('show'), 4000);
        };
        document.getElementById(`${prefix}-confirm-close`).addEventListener('click', close);
        document.getElementById(`${prefix}-confirm-cancel`).addEventListener('click', close);
        backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
        let _pendingCb = null;
        okBtn.addEventListener('click', () => { close(); if (_pendingCb) _pendingCb(); });
        handlers.forEach(({ selector, titleTxt, textFn, okCls, okTxt, toastFn, remove: doRemove, removeFn }) => {
            document.querySelectorAll(selector).forEach(btn => {
                btn.addEventListener('click', () => {
                    title.textContent = titleTxt;
                    text.innerHTML    = textFn(btn);
                    okBtn.className   = `btn ${okCls} btn-magnetic`;
                    okBtn.textContent = okTxt;
                    _pendingCb = () => {
                        showToast(toastFn(btn));
                        const shouldRemove = removeFn ? removeFn(btn) : doRemove;
                        if (shouldRemove) removeRow(btn);
                    };
                    backdrop.classList.add('open');
                });
            });
        });
    }

    // Missing Claims
    setupTwoStep('mc', [
        { selector: '.mc-update-btn', titleTxt: 'Confirm Update',  okCls: 'btn-lime',   okTxt: 'Confirm', removeFn: b => !!b.closest('tr').querySelector('.mc-claim-input')?.value.trim(),
          textFn: b => {
            const tr      = b.closest('tr');
            const claim   = tr.querySelector('.mc-claim-input')?.value.trim();
            const comment = tr.querySelector('.mc-comment-input')?.value.trim();
            let details = '';
            if (claim)   details += ` — Claim <span class="modal-confirm-code">${claim}</span>`;
            if (comment) details += ` — Comment: <em style="color:rgba(255,255,255,0.75)">${comment}</em>`;
            if (!claim && !comment) details = ` <span style="color:var(--amber);font-size:12px">(No claim number or comment entered)</span>`;
            return `Update invoice <span class="modal-confirm-code">${b.dataset.uhap}</span>${details}?`;
          },
          toastFn: b => `Invoice ${b.dataset.uhap} updated.` },
        { selector: '.mc-remove-btn', titleTxt: 'Confirm Removal', okCls: 'btn-danger', okTxt: 'Remove',  remove: true,
          textFn:  b => `Remove invoice <span class="modal-confirm-code">${b.dataset.uhap}</span>? This action cannot be undone.`,
          toastFn: b => `Invoice ${b.dataset.uhap} removed.` },
    ]);

    // Missing GOP
    setupTwoStep('gop', [
        { selector: '.gop-update-btn', titleTxt: 'Confirm Update',      okCls: 'btn-lime',    okTxt: 'Confirm', removeFn: b => !!b.closest('tr').querySelector('.gop-number-input')?.value.trim(),
          textFn:  b => { const gop = b.closest('tr').querySelector('.gop-number-input')?.value.trim(); return gop ? `Update UHAP ID <span class="modal-confirm-code">${b.dataset.uhap}</span> to GOP <span class="modal-confirm-code">${gop}</span>?` : `Update UHAP ID <span class="modal-confirm-code">${b.dataset.uhap}</span>? <span style="color:var(--amber);font-size:12px">(No GOP number entered)</span>`; },
          toastFn: b => { const gop = b.closest('tr').querySelector('.gop-number-input')?.value.trim(); return gop ? `UHAP ${b.dataset.uhap} updated to GOP ${gop}.` : `UHAP ${b.dataset.uhap} updated.`; } },
        { selector: '.gop-wrong-btn',  titleTxt: 'Flag as Wrong Claim', okCls: 'btn-warning', okTxt: 'Flag',    remove: true,
          textFn:  b => `Mark UHAP <span class="modal-confirm-code">${b.dataset.uhap}</span> as wrong claim? This cannot be undone.`,
          toastFn: b => `UHAP ${b.dataset.uhap} flagged as wrong claim.` },
        { selector: '.gop-remove-btn', titleTxt: 'Confirm Removal',     okCls: 'btn-danger',  okTxt: 'Remove',  remove: true,
          textFn:  b => `Remove UHAP <span class="modal-confirm-code">${b.dataset.uhap}</span>? This action cannot be undone.`,
          toastFn: b => `UHAP ${b.dataset.uhap} removed.` },
    ]);

    // Reupload Invoices
    setupTwoStep('ri', [
        { selector: '.ri-reupload-btn', titleTxt: 'Confirm Reupload',      okCls: 'btn-primary', okTxt: 'Reupload',
          textFn:  b => `Reupload invoice <span class="modal-confirm-code">${b.dataset.uhap}</span> (Invoice ID: <span class="modal-confirm-code">${b.dataset.inv}</span>)?`,
          toastFn: b => `Invoice ${b.dataset.inv} queued for reupload.` },
        { selector: '.ri-missing-btn',  titleTxt: 'Mark as Missing Claim', okCls: 'btn-ghost',   okTxt: 'Confirm',
          textFn:  b => `Mark UHAP <span class="modal-confirm-code">${b.dataset.uhap}</span> as a missing claim?`,
          toastFn: b => `UHAP ${b.dataset.uhap} marked as missing claim.` },
    ]);

    // Manual Handling — dropdown rows (no modal)
    const mhToast    = document.getElementById('mh-toast');
    const mhToastMsg = document.getElementById('mh-toast-msg');
    if (mhToast) {
        let _mhTimer = null;
        const showMhToast = (msg) => {
            mhToastMsg.textContent = msg;
            mhToast.classList.add('show');
            clearTimeout(_mhTimer);
            _mhTimer = setTimeout(() => mhToast.classList.remove('show'), 4000);
        };
        document.querySelectorAll('.mh-update-direct-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.closest('tr').querySelector('.mh-comment-select')?.value;
                showMhToast(action ? `UHAP ${btn.dataset.uhap} — "${action}" applied.` : `UHAP ${btn.dataset.uhap} updated.`);
                removeRow(btn);
            });
        });
    }

    // Manual Handling — text rows (two-step)
    setupTwoStep('mh', [
        { selector: '.mh-update-btn', titleTxt: 'Confirm Update',  okCls: 'btn-lime',   okTxt: 'Confirm', remove: true,
          textFn: b => {
            const tr      = b.closest('tr');
            const select  = tr.querySelector('.mh-comment-select');
            const input   = tr.querySelector('.mh-comment-input');
            const comment = select ? select.value : input?.value.trim();
            let details = '';
            if (comment) details = ` — <em style="color:rgba(255,255,255,0.75)">${comment}</em>`;
            else         details = ` <span style="color:var(--amber);font-size:12px">(No comment entered)</span>`;
            return `Update UHAP <span class="modal-confirm-code">${b.dataset.uhap}</span>${details}?`;
          },
          toastFn: b => `UHAP ${b.dataset.uhap} updated.` },
        { selector: '.mh-remove-btn', titleTxt: 'Confirm Removal', okCls: 'btn-danger', okTxt: 'Remove',  remove: true,
          textFn:  b => `Remove UHAP <span class="modal-confirm-code">${b.dataset.uhap}</span>? This action cannot be undone.`,
          toastFn: b => `UHAP ${b.dataset.uhap} removed.` },
    ]);

    // Organization Manager
    const ORG_TEAM_OPTS = ['Prague GER','Prague ITA','Prague SPA','Prague CZE','Prague POL','Prague Inter','Bangkok Nordic','Bangkok UK'];
    function buildOrgRespCell(trigger) {
        if (trigger === 'External') {
            return `<input class="input input-plain org-resp-input" type="text" placeholder="email@domain.com">`;
        }
        return `<select class="select org-resp-select">${ORG_TEAM_OPTS.map(t => `<option>${t}</option>`).join('')}</select>`;
    }
    const orgTable  = document.getElementById('org-table');
    const orgAddBtn = document.getElementById('org-add-btn');
    const orgDelBackdrop = document.getElementById('org-del-backdrop');
    const orgToast       = document.getElementById('org-toast');
    const orgToastMsg    = document.getElementById('org-toast-msg');
    let _orgDelRow = null, _orgDelTimer = null;
    if (orgDelBackdrop) {
        const orgDelClose = () => orgDelBackdrop.classList.remove('open');
        const orgShowToast = (msg) => {
            orgToastMsg.textContent = msg;
            orgToast.classList.add('show');
            clearTimeout(_orgDelTimer);
            _orgDelTimer = setTimeout(() => orgToast.classList.remove('show'), 4000);
        };
        document.getElementById('org-del-close').addEventListener('click', orgDelClose);
        document.getElementById('org-del-cancel').addEventListener('click', orgDelClose);
        orgDelBackdrop.addEventListener('click', e => { if (e.target === orgDelBackdrop) orgDelClose(); });
        document.getElementById('org-del-ok').addEventListener('click', () => {
            orgDelClose();
            const orgName = _orgDelRow ? (_orgDelRow.querySelector('.org-name-input')?.value || 'Organization') : 'Organization';
            if (_orgDelRow) _orgDelRow.remove();
            orgShowToast(`${orgName} removed.`);
        });
    }
    if (orgTable) {
        orgTable.addEventListener('change', e => {
            if (!e.target.classList.contains('org-trigger-select')) return;
            e.target.closest('tr').querySelector('.org-resp-cell').innerHTML = buildOrgRespCell(e.target.value);
        });
        orgTable.addEventListener('click', e => {
            const del = e.target.closest('.org-row-delete');
            if (del && orgDelBackdrop) {
                _orgDelRow = del.closest('tr');
                const orgName = _orgDelRow.querySelector('.org-name-input')?.value || 'this organization';
                document.getElementById('org-del-text').innerHTML = `Remove <span class="modal-confirm-code">${orgName}</span>? This action cannot be undone.`;
                orgDelBackdrop.classList.add('open');
            }
        });
    }
    if (orgAddBtn && orgTable) {
        orgAddBtn.addEventListener('click', () => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input class="input input-plain org-name-input" type="text" placeholder="Organization name"></td>
                <td style="width:160px"><select class="select org-trigger-select"><option>ECA</option><option>ECA + ECL</option><option>External</option></select></td>
                <td class="org-resp-cell"><select class="select org-resp-select">${ORG_TEAM_OPTS.map(t => `<option>${t}</option>`).join('')}</select></td>
                <td style="width:44px;text-align:center"><button class="btn btn-danger btn-sm btn-magnetic org-row-delete">${ICONS.trash}</button></td>
            `;
            orgTable.querySelector('tbody').appendChild(tr);
            tr.querySelector('.org-name-input').focus();
            tr.querySelectorAll('.btn-magnetic').forEach(btn => {
                btn.addEventListener('mousemove', e => {
                    const r = btn.getBoundingClientRect();
                    btn.style.transform = `translate(${(e.clientX-r.left-r.width/2)*0.18}px,${(e.clientY-r.top-r.height/2)*0.18}px) translateY(-1px)`;
                });
                btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
            });
        });
    }
}

// ===================================================
//  INIT
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
    // Sidebar toggle — migrate class from <html> (set by inline head script) to <body>,
    // then re-enable transitions after the first frame.
    const toggleBtn = document.getElementById('sidebar-toggle');
    const wasCollapsed = document.documentElement.classList.contains('sidebar-collapsed');
    if (wasCollapsed) {
        document.body.classList.add('sidebar-collapsed');
        document.documentElement.classList.remove('sidebar-collapsed');
        toggleBtn.setAttribute('aria-expanded', 'false');
    }
    // Remove the no-transition init class after two frames so it is guaranteed to be
    // post-paint (single rAF fires before paint; double rAF fires after the frame is committed).
    requestAnimationFrame(() => requestAnimationFrame(() => {
        document.documentElement.classList.remove('sidebar-collapsed-init');
    }));
    toggleBtn.addEventListener('click', () => {
        const isNowCollapsed = document.body.classList.toggle('sidebar-collapsed');
        toggleBtn.setAttribute('aria-expanded', String(!isNowCollapsed));
        localStorage.setItem('sidebar-collapsed', String(isNowCollapsed));
    });

    document.querySelectorAll('.nav-item[data-view]').forEach(item => {
        item.addEventListener('click', () => navigate(item.dataset.view));
    });
    document.getElementById('sidebar-home-btn').addEventListener('click', () => navigate('landing'));
    document.getElementById('content-area').innerHTML = VIEWS['landing'].render();
    attachInteractions();
});
