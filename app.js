
const API_CONFIG = {
    endpoint: 'https://1oyni7kt8k.execute-api.ap-south-1.amazonaws.com/prod/classify',
    timeout: 30000,
    method: 'POST'
};


const TUMOR_DATA = {
    glioma: {
        name: 'Glioma',
        description: 'Aggressive brain tumors arising from glial cells, accounting for approximately 50.4% of primary brain tumors',
        severity: 'High - Malignant',
        grades: 'WHO Grade I-IV (Glioblastoma is Grade IV)',
        color: '#E74C3C',
        symptoms: [
            'Headaches (especially morning headaches)',
            'Seizures',
            'Nausea and vomiting',
            'Cognitive and memory problems',
            'Personality changes',
            'Vision problems',
            'Speech difficulties',
            'Motor weakness'
        ],
        immediate_actions: [
            'Schedule urgent consultation with neuro-oncologist',
            'Obtain detailed MRI with contrast if not already done',
            'Consider referral to specialized brain tumor center',
            'Discuss with neurosurgeon for surgical evaluation'
        ],
        treatments: [
            'Maximal safe surgical resection (primary treatment)',
            'Radiation therapy (concurrent with chemotherapy)',
            'Chemotherapy - Temozolomide (standard for glioblastoma)',
            'Clinical trials for novel therapies',
            'Tumor Treating Fields (TTFields) for glioblastoma',
            'Supportive care - steroids for brain swelling, anti-seizure medications'
        ],
        prognosis: 'Varies by grade - Low-grade gliomas (Grade I-II) have better prognosis with median survival of several years. Glioblastoma (Grade IV) has median survival of 15-18 months with standard treatment.',
        monitoring: [
            'Regular MRI scans (typically every 2-3 months initially)',
            'Neurological examinations',
            'Quality of life assessments',
            'Monitor for treatment side effects'
        ],
        lifestyle: [
            'Maintain healthy diet rich in antioxidants',
            'Adequate rest and sleep management',
            'Gentle physical activity as tolerated',
            'Cognitive rehabilitation if needed',
            'Join support groups for emotional support',
            'Consider palliative care consultation for symptom management'
        ]
    },
    meningioma: {
        name: 'Meningioma',
        description: 'Typically benign tumors arising from meninges (brain coverings), accounting for approximately 20.8% of primary brain tumors',
        severity: 'Low to Moderate - Usually benign (75% are Grade I)',
        grades: 'WHO Grade I (Benign), Grade II (Atypical), Grade III (Anaplastic)',
        color: '#3498DB',
        symptoms: [
            'Headaches',
            'Vision problems (if near optic nerves)',
            'Hearing loss or tinnitus',
            'Memory problems',
            'Seizures (in some cases)',
            'Weakness in arms or legs',
            'Often asymptomatic (found incidentally)'
        ],
        immediate_actions: [
            'Consult with neurosurgeon to assess need for intervention',
            'Complete neurological evaluation',
            'Consider watchful waiting if tumor is small and asymptomatic',
            'Obtain baseline MRI for future comparison'
        ],
        treatments: [
            'Observation with regular MRI monitoring (for small, asymptomatic tumors)',
            'Surgical removal (for symptomatic or growing tumors)',
            'Stereotactic radiosurgery (Gamma Knife) for surgically inaccessible tumors',
            'Fractionated radiation therapy for larger tumors',
            'Proton beam therapy (reduces damage to surrounding tissue)',
            'Adjuvant radiotherapy for atypical (Grade II) and anaplastic (Grade III) types'
        ],
        prognosis: 'Excellent for Grade I meningiomas with 5-year survival greater than 90%. Grade II and III have higher recurrence rates and may require more aggressive treatment.',
        monitoring: [
            'Annual MRI scans for 3 years if stable, then less frequently',
            'Monitor for tumor growth (typically 1-2mm per year)',
            'Regular neurological check-ups',
            'Vision and hearing tests if applicable'
        ],
        lifestyle: [
            'Maintain normal activities if asymptomatic',
            'Regular exercise and healthy diet',
            'Manage stress levels',
            'Avoid unnecessary radiation exposure',
            'Regular follow-up appointments',
            'Monitor for new or worsening symptoms'
        ]
    },
    pituitary: {
        name: 'Pituitary Adenoma',
        description: 'Benign growths in the pituitary gland that can affect hormone production, accounting for approximately 15% of primary brain tumors',
        severity: 'Low to Moderate - Usually benign',
        grades: 'Functioning (hormone-producing) or Non-functioning adenomas',
        color: '#9B59B6',
        symptoms: [
            'Vision problems (especially peripheral vision loss)',
            'Headaches',
            'Hormonal imbalances',
            'Irregular menstrual periods or infertility',
            'Excessive growth (acromegaly)',
            'Fatigue and weakness',
            'Unexplained weight changes'
        ],
        immediate_actions: [
            'Consult endocrinologist for hormonal evaluation',
            'Complete hormone panel blood tests',
            'Visual field testing by ophthalmologist',
            'MRI of pituitary gland with contrast',
            'Consult neurosurgeon if tumor is large or causing compression'
        ],
        treatments: [
            'Medical therapy (dopamine agonists for prolactinomas)',
            'Somatostatin analogs for growth hormone-secreting tumors',
            'Transsphenoidal surgery (minimally invasive through nose)',
            'Stereotactic radiosurgery for residual/recurrent tumors',
            'Fractionated radiation therapy',
            'Proton beam therapy',
            'Hormone replacement therapy if needed'
        ],
        prognosis: 'Generally excellent. Most pituitary adenomas are benign and treatable. Prolactinomas respond very well to medication (greater than 90% success rate). Surgical cure rates vary by tumor type and size.',
        monitoring: [
            'Regular hormone level monitoring (every 3-6 months initially)',
            'Periodic MRI scans to check tumor size',
            'Visual field examinations',
            'Bone density scans if prolonged hormone imbalance',
            'Annual endocrinology follow-up'
        ],
        lifestyle: [
            'Take prescribed medications consistently',
            'Regular hormone level monitoring',
            'Manage symptoms related to hormone imbalance',
            'Maintain healthy weight',
            'Regular exercise appropriate to hormone levels',
            'Stress management techniques',
            'Join pituitary disorder support groups'
        ]
    },
    no_tumor: {
        name: 'No Tumor Detected',
        description: 'No brain tumor detected in the MRI scan',
        severity: 'None',
        color: '#27AE60',
        message: 'Great news! No tumor was detected in your brain MRI scan.',
        recommendations: [
            'Continue with regular health check-ups',
            'If experiencing symptoms, consult neurologist for other possible causes',
            'Maintain healthy lifestyle with balanced diet and regular exercise',
            'Adequate sleep (7-9 hours per night)',
            'Stress management and mental health care',
            'Brain health practices - mental stimulation and social engagement',
            'Manage chronic conditions (diabetes, hypertension)',
            'Protect head from injuries (wear helmets during sports)'
        ],
        preventive_measures: [
            'Limit exposure to radiation when possible',
            'Maintain cardiovascular health',
            'Control blood pressure and cholesterol',
            'Regular health screenings as appropriate for age',
            'Avoid smoking and limit alcohol consumption'
        ]
    }
};


let appState = {
    currentImage: null,
    currentImageFile: null,
    lastResult: null,
    isAnalyzing: false
};


const elements = {
    uploadZone: document.getElementById('uploadZone'),
    fileInput: document.getElementById('fileInput'),
    browseBtn: document.getElementById('browseBtn'),
    uploadContent: document.getElementById('uploadContent'),
    previewContent: document.getElementById('previewContent'),
    imagePreview: document.getElementById('imagePreview'),
    fileName: document.getElementById('fileName'),
    changeImageBtn: document.getElementById('changeImageBtn'),
    analyzeBtn: document.getElementById('analyzeBtn'),
    sampleImageBtn: document.getElementById('sampleImageBtn'),
    uploadSection: document.getElementById('uploadSection'),
    loadingSection: document.getElementById('loadingSection'),
    resultsSection: document.getElementById('resultsSection'),
    errorSection: document.getElementById('errorSection'),
    errorMessage: document.getElementById('errorMessage'),
    retryBtn: document.getElementById('retryBtn'),
    resultBadge: document.getElementById('resultBadge'),
    resultTitle: document.getElementById('resultTitle'),
    resultDescription: document.getElementById('resultDescription'),
    resultSeverity: document.getElementById('resultSeverity'),
    tabsNav: document.getElementById('tabsNav'),
    tabsContent: document.getElementById('tabsContent'),
    printBtn: document.getElementById('printBtn'),
    analyzeAnotherBtn: document.getElementById('analyzeAnotherBtn')
};


function init() {
    setupEventListeners();
    console.log('Brain MRI Classification System initialized');
    console.log('API Endpoint:', API_CONFIG.endpoint);
}


function setupEventListeners() {
    elements.uploadZone.addEventListener('dragover', handleDragOver);
    elements.uploadZone.addEventListener('dragleave', handleDragLeave);
    elements.uploadZone.addEventListener('drop', handleDrop);
    elements.uploadZone.addEventListener('click', () => {
        if (!appState.currentImage) {
            elements.fileInput.click();
        }
    });

    
    elements.fileInput.addEventListener('change', handleFileSelect);

    
    elements.browseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.fileInput.click();
    });

    
    elements.changeImageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetUpload();
    });

    
    elements.analyzeBtn.addEventListener('click', analyzeImage);

    
    elements.sampleImageBtn.addEventListener('click', loadSampleImage);

    
    elements.retryBtn.addEventListener('click', () => {
        hideError();
        showSection('upload');
    });

    
    elements.printBtn.addEventListener('click', () => {
        window.print();
    });

    
    elements.analyzeAnotherBtn.addEventListener('click', () => {
        resetApplication();
    });

    
    elements.tabsNav.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-btn')) {
            switchTab(e.target.dataset.tab);
        }
    });
}


function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    elements.uploadZone.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    elements.uploadZone.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    elements.uploadZone.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}


function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}


function handleFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
        showError('Please upload a valid image file (JPG, PNG, JPEG)');
        return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        showError('File size exceeds 10MB. Please upload a smaller image.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        appState.currentImage = e.target.result;
        appState.currentImageFile = file;
        displayImagePreview(e.target.result, file.name);
    };
    reader.onerror = () => {
        showError('Error reading file. Please try again.');
    };
    reader.readAsDataURL(file);
}


function displayImagePreview(imageSrc, fileName) {
    elements.imagePreview.src = imageSrc;
    elements.fileName.textContent = fileName;
    elements.uploadContent.style.display = 'none';
    elements.previewContent.style.display = 'flex';
    elements.analyzeBtn.disabled = false;
}

function resetUpload() {
    appState.currentImage = null;
    appState.currentImageFile = null;
    elements.fileInput.value = '';
    elements.uploadContent.style.display = 'block';
    elements.previewContent.style.display = 'none';
    elements.analyzeBtn.disabled = true;
}

function loadSampleImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, 400, 400);
    
    ctx.fillStyle = '#404040';
    ctx.beginPath();
    ctx.arc(200, 200, 150, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#606060';
    ctx.beginPath();
    ctx.arc(200, 200, 120, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#808080';
    ctx.beginPath();
    ctx.arc(200, 200, 80, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Sample MRI Image', 200, 380);
    
    appState.currentImage = canvas.toDataURL('image/png');
    displayImagePreview(appState.currentImage, 'sample-mri.png');
}

async function analyzeImage() {
    if (!appState.currentImage || appState.isAnalyzing) {
        return;
    }

    appState.isAnalyzing = true;
    showSection('loading');

    try {
        const base64Image = appState.currentImage.split(',')[1] || appState.currentImage;
        
        console.log('Sending analysis request to:', API_CONFIG.endpoint);
        console.log('Image data size:', base64Image.length, 'bytes');
        
        const response = await fetchWithTimeout(API_CONFIG.endpoint, {
            method: API_CONFIG.method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: base64Image
            })
        }, API_CONFIG.timeout);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API response not OK:', response.status, errorText);
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('API Response received:', result);
        if (!result.tumor_type) {
            console.error('Invalid response format:', result);
            throw new Error('Invalid response format from API');
        }

        appState.lastResult = result;
        displayResults(result.tumor_type, result.confidence);
        
    } catch (error) {
        console.error('Analysis error:', error);
        handleAnalysisError(error);
    } finally {
        appState.isAnalyzing = false;
    }
}

function fetchWithTimeout(url, options, timeout) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
    ]);
}

function handleAnalysisError(error) {
    let errorMsg = 'An unexpected error occurred during analysis.';

    if (error.message === 'Request timeout') {
        errorMsg = 'The analysis request timed out. Please check your connection and try again.';
    } else if (error.message.includes('Failed to fetch')) {
        errorMsg = 'Unable to connect to the classification service. Please check the API endpoint configuration and your network connection.';
    } else if (error.message.includes('API Error: 403')) {
        errorMsg = 'Access denied. Please check the API Gateway configuration and permissions.';
    } else if (error.message.includes('API Error: 502')) {
        errorMsg = 'Service temporarily unavailable. The Lambda function may be misconfigured.';
    } else if (error.message.includes('API Error: 400')) {
        errorMsg = 'Invalid image format. Please upload a valid JPG or PNG image.';
    } else if (error.message.includes('API Error: 500')) {
        errorMsg = 'Internal server error. Please check Lambda function logs.';
    } else if (error.message.includes('Invalid response')) {
        errorMsg = 'Received invalid response from the classification service. Please try again.';
    }

    console.error('Analysis error details:', error);
    elements.errorMessage.textContent = errorMsg;
    showSection('error');
}

function displayResults(tumorType, confidence) {
    const normalizedTumorType = tumorType === 'notumor' ? 'no_tumor' : tumorType;
    const data = TUMOR_DATA[normalizedTumorType];
    
    if (!data) {
        showError('Unknown tumor type received from API: ' + tumorType);
        return;
    }

    elements.resultBadge.textContent = data.name;
    elements.resultBadge.style.backgroundColor = data.color;
    elements.resultTitle.textContent = data.name;
    elements.resultDescription.textContent = data.description;
    
    const confidenceInfo = document.createElement('div');
    confidenceInfo.className = 'confidence-info';
    confidenceInfo.style.marginTop = '10px';
    confidenceInfo.style.padding = '8px';
    confidenceInfo.style.backgroundColor = '#f8f9fa';
    confidenceInfo.style.borderRadius = '4px';
    confidenceInfo.style.fontSize = '14px';
    confidenceInfo.innerHTML = `<strong>Confidence Level:</strong> ${confidence}%`;
    elements.resultDescription.appendChild(confidenceInfo);
    
    if (tumorType !== 'no_tumor') {
        elements.resultSeverity.textContent = `Severity: ${data.severity}`;
        elements.resultSeverity.style.display = 'block';
    } else {
        elements.resultSeverity.style.display = 'none';
    }

    generateTabContent(tumorType, data);

    showSection('results');
}

function generateTabContent(tumorType, data) {
    elements.tabsContent.innerHTML = '';

    if (tumorType === 'no_tumor') {

        const overviewTab = createTabContent('overview', [
            { title: 'Result', content: `<p class="info-box success">${data.message}</p>` }
        ]);
        const recommendationsTab = createTabContent('symptoms', [
            { title: 'General Health Recommendations', list: data.recommendations }
        ]);
        const preventiveTab = createTabContent('actions', [
            { title: 'Preventive Measures', list: data.preventive_measures }
        ]);

        elements.tabsContent.appendChild(overviewTab);
        elements.tabsContent.appendChild(recommendationsTab);
        elements.tabsContent.appendChild(preventiveTab);

        updateTabsForNoTumor();
    } else {
        const overviewTab = createTabContent('overview', [
            { title: 'Description', content: `<p>${data.description}</p>` },
            { title: 'Severity', content: `<p class="info-box warning">${data.severity}</p>` },
            { title: 'Classification', content: `<p>${data.grades}</p>` }
        ]);

        const symptomsTab = createTabContent('symptoms', [
            { title: 'Common Symptoms', list: data.symptoms }
        ]);

        const actionsTab = createTabContent('actions', [
            { title: 'Immediate Actions Required', list: data.immediate_actions },
            { title: '', content: '<p class="info-box warning">These are urgent recommendations. Please consult with healthcare professionals as soon as possible.</p>' }
        ]);

        const treatmentTab = createTabContent('treatment', [
            { title: 'Treatment Options', list: data.treatments },
            { title: '', content: '<p class="info-box">Treatment plans should be discussed with your medical team and tailored to your specific situation.</p>' }
        ]);

        const prognosisTab = createTabContent('prognosis', [
            { title: 'Expected Outcomes', content: `<p>${data.prognosis}</p>` },
            { title: '', content: '<p class="info-box">Prognosis varies significantly based on individual factors. Discuss your specific case with your oncology team.</p>' }
        ]);

        const monitoringTab = createTabContent('monitoring', [
            { title: 'Follow-up Care', list: data.monitoring }
        ]);

        const lifestyleTab = createTabContent('lifestyle', [
            { title: 'Lifestyle Recommendations', list: data.lifestyle },
            { title: '', content: '<p class="info-box">Maintaining quality of life is important. Work with your healthcare team to manage symptoms and side effects.</p>' }
        ]);

        elements.tabsContent.appendChild(overviewTab);
        elements.tabsContent.appendChild(symptomsTab);
        elements.tabsContent.appendChild(actionsTab);
        elements.tabsContent.appendChild(treatmentTab);
        elements.tabsContent.appendChild(prognosisTab);
        elements.tabsContent.appendChild(monitoringTab);
        elements.tabsContent.appendChild(lifestyleTab);

        resetTabsNavigation();
    }

    switchTab('overview');
}

function createTabContent(tabId, sections) {
    const tabDiv = document.createElement('div');
    tabDiv.className = 'tab-content';
    tabDiv.dataset.tab = tabId;

    sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'tab-section';

        if (section.title) {
            const title = document.createElement('h3');
            title.textContent = section.title;
            sectionDiv.appendChild(title);
        }

        if (section.content) {
            sectionDiv.innerHTML += section.content;
        }

        if (section.list) {
            const ul = document.createElement('ul');
            section.list.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                ul.appendChild(li);
            });
            sectionDiv.appendChild(ul);
        }

        tabDiv.appendChild(sectionDiv);
    });

    return tabDiv;
}

function switchTab(tabId) {
    const tabButtons = elements.tabsNav.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const tabContents = elements.tabsContent.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        if (content.dataset.tab === tabId) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

function updateTabsForNoTumor() {
    const tabButtons = elements.tabsNav.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        const tab = btn.dataset.tab;
        if (tab === 'overview' || tab === 'symptoms' || tab === 'actions') {
            btn.style.display = 'block';
            if (tab === 'symptoms') btn.textContent = 'Recommendations';
            if (tab === 'actions') btn.textContent = 'Prevention';
        } else {
            btn.style.display = 'none';
        }
    });
}

function resetTabsNavigation() {
    const tabButtons = elements.tabsNav.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.style.display = 'block';
        if (btn.dataset.tab === 'symptoms') btn.textContent = 'Symptoms';
        if (btn.dataset.tab === 'actions') btn.textContent = 'Immediate Actions';
    });
}

function showSection(section) {
    elements.uploadSection.style.display = 'none';
    elements.loadingSection.style.display = 'none';
    elements.resultsSection.style.display = 'none';
    elements.errorSection.style.display = 'none';

    switch (section) {
        case 'upload':
            elements.uploadSection.style.display = 'block';
            break;
        case 'loading':
            elements.loadingSection.style.display = 'block';
            break;
        case 'results':
            elements.resultsSection.style.display = 'block';
            break;
        case 'error':
            elements.errorSection.style.display = 'block';
            break;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showError(message) {
    elements.errorMessage.textContent = message;
    showSection('error');
}

function hideError() {
    elements.errorMessage.textContent = '';
}

function resetApplication() {
    resetUpload();
    appState.lastResult = null;
    showSection('upload');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TUMOR_DATA,
        appState,
        analyzeImage,
        handleAnalysisError
    };
}