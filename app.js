// ==================== Global State ====================
let appState = {
    chartType: 'bar',
    inputMethod: 'manual',
    data: {
        labels: [],
        values: [],
        title: '',
        colors: []
    },
    arSession: null,
    currentChart: null
};

// Color palette
const COLORS = [
    '#4A90E2', '#E94B3C', '#6BCF7F', '#F5A623',
    '#9013FE', '#50E3C2', '#FF6B9D', '#FFC837'
];

// Sample datasets
const SAMPLE_DATA = {
    sales: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        values: [45000, 67000, 82000, 91000],
        title: 'Sales Data 2024'
    },
    survey: {
        labels: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'],
        values: [45, 30, 15, 10],
        title: 'Customer Satisfaction Survey'
    },
    grades: {
        labels: ['A', 'B', 'C', 'D', 'E'],
        values: [25, 35, 20, 15, 5],
        title: 'Student Grades Distribution'
    }
};

// Flag: enable auto-place globally for AR view.
// ar.html will consult this to decide whether to attach tap-to-place.
window.AUTO_PLACE = true;

// ===== Helper: unified interaction listener (pointer/touch/click) =====
function addInteractionListener(el, handler, options = {}) {
    if (!el) return;
    const passive = options.passive !== undefined ? options.passive : true;
    const wrapped = (ev) => {
        // prevent double firing when touch triggers click
        if (ev.type === 'touchend') ev.preventDefault?.();
        handler(ev);
    };

    if (window.PointerEvent) {
        el.addEventListener('pointerdown', wrapped, { passive });
    } else {
        el.addEventListener('touchend', wrapped, { passive });
        el.addEventListener('click', wrapped, { passive });
    }
}

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', () => {
    initResponsiveFixes();

    if (document.querySelector('.container')) {
        initMainPage();
    } else if (document.querySelector('.ar-body')) {
        console.log('AR page loaded');
    }
});

function initResponsiveFixes() {
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            updatePreview();
            if (appState.currentChart) {
                try { appState.currentChart.object3D?.updateMatrixWorld(); } catch (e) {}
            }
        }, 200);
    }, false);

    window.addEventListener('resize', () => {
        updatePreview();
    }, { passive: true });
}

// ==================== Main Page Logic ====================
function initMainPage() {
    setupChartTypeButtons();
    setupInputMethodButtons();
    setupDataInput();
    setupLaunchButton();
}

function setupChartTypeButtons() {
    const buttons = document.querySelectorAll('.chart-type-btn');

    buttons.forEach(btn => {
        addInteractionListener(btn, () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            appState.chartType = btn.dataset.type;
            updatePreview();
        });
    });
}

function setupInputMethodButtons() {
    const buttons = document.querySelectorAll('.method-btn');
    const manualInput = document.getElementById('manual-input');
    const sampleInput = document.getElementById('sample-input');

    buttons.forEach(btn => {
        addInteractionListener(btn, () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            appState.inputMethod = btn.dataset.method;

            if (appState.inputMethod === 'manual') {
                manualInput && (manualInput.style.display = 'block');
                sampleInput && (sampleInput.style.display = 'none');
            } else {
                manualInput && (manualInput.style.display = 'none');
                sampleInput && (sampleInput.style.display = 'block');
                loadSampleData();
            }

            updatePreview();
        });
    });

    const activeSampleBtn = document.querySelector('.method-btn[data-method="sample"]');
    if (activeSampleBtn && activeSampleBtn.classList.contains('active')) {
        loadSampleData();
        updatePreview();
    }
}

function setupDataInput() {
    const labelsInput = document.getElementById('labels-input');
    const valuesInput = document.getElementById('values-input');
    const titleInput = document.getElementById('title-input');
    const sampleSelect = document.getElementById('sample-select');

    labelsInput?.addEventListener('input', () => {
        appState.data.labels = labelsInput.value.split(',').map(l => l.trim()).filter(l => l);
        updatePreview();
    }, { passive: true });

    valuesInput?.addEventListener('input', () => {
        appState.data.values = valuesInput.value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
        updatePreview();
    }, { passive: true });

    titleInput?.addEventListener('input', () => {
        appState.data.title = titleInput.value;
        updatePreview();
    }, { passive: true });

    sampleSelect?.addEventListener('change', () => {
        loadSampleData();
        updatePreview();
    }, { passive: true });
}

function loadSampleData() {
    const sampleSelect = document.getElementById('sample-select');
    if (!sampleSelect) {
        console.error('Sample select not found');
        return;
    }

    const selectedSample = sampleSelect.value;
    console.log('Loading sample data:', selectedSample);
    const data = SAMPLE_DATA[selectedSample];

    if (data) {
        appState.data.labels = [...data.labels];
        appState.data.values = [...data.values];
        appState.data.title = data.title;
        appState.data.colors = generateColors(data.values.length);
        console.log('Sample data loaded:', appState.data);
    } else {
        console.error('Sample data not found for:', selectedSample);
    }
}

function generateColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) colors.push(COLORS[i % COLORS.length]);
    return colors;
}

function updatePreview() {
    const previewContent = document.getElementById('preview-content');
    if (!previewContent) return;

    if (appState.data.labels.length === 0 || appState.data.values.length === 0) {
        previewContent.innerHTML = '<p class="placeholder">Data akan muncul di sini...</p>';
        return;
    }

    if (appState.data.colors.length !== appState.data.values.length) {
        appState.data.colors = generateColors(appState.data.values.length);
    }

    let html = '<div class="preview-table">';
    html += '<div class="preview-row header"><div>Label</div><div>Value</div><div>Color</div></div>';

    for (let i = 0; i < Math.min(appState.data.labels.length, appState.data.values.length); i++) {
        const color = appState.data.colors[i] || COLORS[0];
        html += `<div class="preview-row">
            <div class="cell label">${appState.data.labels[i]}</div>
            <div class="cell value">${appState.data.values[i]}</div>
            <div class="cell color"><span style="display:inline-block;width:20px;height:20px;background:${color};border-radius:4px;"></span></div>
        </div>`;
    }

    html += '</div>';
    previewContent.innerHTML = html;
}

// ==================== Launch button (supports touch) ====================
function setupLaunchButton() {
    const launchBtn = document.getElementById('launch-ar-btn');

    addInteractionListener(launchBtn, () => {
        console.log('Launch AR button clicked');
        console.log('Current state:', appState);

        if (appState.data.labels.length === 0 || appState.data.values.length === 0) {
            alert('⚠️ Silakan input data terlebih dahulu!');
            return;
        }

        if (appState.data.labels.length !== appState.data.values.length) {
            alert('⚠️ Jumlah labels dan values harus sama!');
            return;
        }

        if (appState.data.colors.length === 0) {
            appState.data.colors = generateColors(appState.data.values.length);
        }

        const dataToSave = {
            type: appState.chartType,
            data: appState.data
        };

        console.log('Saving data to localStorage:', dataToSave);
        try {
            localStorage.setItem('arChartData', JSON.stringify(dataToSave));
        } catch (e) {
            console.warn('LocalStorage write failed:', e);
            alert('⚠️ Tidak dapat menyimpan data di device ini.');
            return;
        }

        console.log('Navigating to ar.html');
        window.location.href = 'ar.html';
    });
}

// ==================== AR View Logic ====================
function initARView() {
    console.log('=== INIT AR VIEW START ===');

    const savedData = localStorage.getItem('arChartData');
    console.log('Raw saved data:', savedData);

    if (!savedData) {
        console.error('No data found in localStorage');
        alert('⚠️ No data found. Redirecting to input page...');
        setTimeout(() => { window.location.href = 'index.html'; }, 1000);
        return;
    }

    try {
        const chartData = JSON.parse(savedData);
        console.log('Parsed chart data:', chartData);

        appState.chartType = chartData.type;
        appState.data = chartData.data;

        console.log('Chart type:', appState.chartType);
        console.log('Chart data:', appState.data);

        if (!appState.data.colors || appState.data.colors.length === 0) {
            appState.data.colors = generateColors(appState.data.values.length);
            console.log('Generated colors:', appState.data.colors);
        }

        setupARControls();
        console.log('✅ AR controls setup complete');

        setupWebXR();
        console.log('✅ WebXR setup complete');

        // === AUTO-PLACE CHART (no clicks required) ===
        // Delay slightly to let the scene render and A-Frame finish setup
        setTimeout(() => {
            try {
                // Hide placement UI so it doesn't confuse user
                const placementMarker = document.getElementById('placement-marker');
                const placeBtn = document.getElementById('place-chart-btn');
                if (placementMarker) {
                    placementMarker.setAttribute('visible', false);
                    console.log('Placement marker hidden (auto-place).');
                }
                if (placeBtn) {
                    placeBtn.style.display = 'none';
                    console.log('Place button hidden (auto-place).');
                }

                // If available, place chart
                if (typeof placeChartOnGround === 'function') {
                    console.log('Auto-placing chart...');
                    // Option: place slightly in front of camera if desired
                    // We'll attempt to place at default groundPosition used by placeChartOnGround()
                    placeChartOnGround();
                } else {
                    console.warn('placeChartOnGround() not available for auto-place.');
                }
            } catch (e) {
                console.warn('Auto-place failed:', e);
            }
        }, 350);

        console.log('=== INIT AR VIEW COMPLETE ===');
    } catch (error) {
        console.error('Error in initARView:', error);
        alert('⚠️ Error loading data: ' + error.message);
        setTimeout(() => { window.location.href = 'index.html'; }, 1000);
    }
}

function setupARControls() {
    const backBtn = document.getElementById('back-btn');
    const placeBtn = document.getElementById('place-chart-btn');
    const rotateLeftBtn = document.getElementById('rotate-left-btn');
    const rotateRightBtn = document.getElementById('rotate-right-btn');
    const scaleUpBtn = document.getElementById('scale-up-btn');
    const scaleDownBtn = document.getElementById('scale-down-btn');
    const resetBtn = document.getElementById('reset-btn');
    const deleteBtn = document.getElementById('delete-btn');

    addInteractionListener(backBtn, () => { window.location.href = 'index.html'; });
    addInteractionListener(placeBtn, () => { placeChartOnGround(); });
    addInteractionListener(rotateLeftBtn, () => { rotateChart(-15); });
    addInteractionListener(rotateRightBtn, () => { rotateChart(15); });
    addInteractionListener(scaleUpBtn, () => { scaleChart(1.2); });
    addInteractionListener(scaleDownBtn, () => { scaleChart(0.8); });
    addInteractionListener(resetBtn, () => { resetChart(); });
    addInteractionListener(deleteBtn, () => { deleteChart(); });

    console.log('✅ AR controls setup complete');
}

function setupWebXR() {
    console.log('=== SETUP WEBXR START ===');

    const scene = document.querySelector('a-scene');
    const placementMarker = document.getElementById('placement-marker');
    const placeBtn = document.getElementById('place-chart-btn');
    const statusText = document.getElementById('status-text');

    if (!scene) {
        console.error('A-Frame scene not found!');
        return;
    }

    console.log('Scene found');

    if (placementMarker) {
        placementMarker.setAttribute('visible', true);
        console.log('✅ Placement marker visible on ground');
    }

    if (placeBtn) {
        placeBtn.disabled = false;
        console.log('✅ Place button enabled');
    }

    if (statusText) {
        statusText.textContent = 'Tap "Place Chart" to visualize your data';
        console.log('✅ Status text updated');
    }

    try {
        if (scene.hasAttribute && !scene.getAttribute('embedded')) {
            scene.setAttribute('embedded', '');
        }
        scene.setAttribute('vr-mode-ui', 'enabled: true');
    } catch (e) {}

    console.log('=== SETUP WEBXR COMPLETE ===');
}

function placeChartOnGround() {
    console.log('=== PLACE CHART ON GROUND START ===');

    const placementMarker = document.getElementById('placement-marker');
    const chartContainer = document.getElementById('chart-container');
    const statusText = document.getElementById('status-text');
    const sideControls = document.querySelector('.side-controls');
    const placeBtn = document.getElementById('place-chart-btn');

    console.log('Chart type:', appState.chartType);
    console.log('Chart data:', appState.data);

    if (!chartContainer) {
        console.error('Chart container not found!');
        return;
    }

    if (placementMarker) {
        placementMarker.setAttribute('visible', false);
        console.log('✅ Placement marker hidden');
    }

    // Ground position (Y = 0 is ground level)
    const groundPosition = { x: 0, y: 0, z: -2 };
    console.log('Chart will be placed at ground position:', groundPosition);

    let chart;
    try {
        switch(appState.chartType) {
            case 'bar':
                console.log('Creating bar chart on ground...');
                chart = createBarChart(groundPosition);
                break;
            case 'pie':
                console.log('Creating pie chart on ground...');
                chart = createPieChart(groundPosition);
                break;
            case 'histogram':
                console.log('Creating histogram on ground...');
                chart = createHistogram(groundPosition);
                break;
            default:
                console.log('Unknown type, defaulting to bar chart');
                chart = createBarChart(groundPosition);
        }

        console.log('Chart created:', chart);

        chartContainer.innerHTML = '';
        chartContainer.appendChild(chart);
        appState.currentChart = chart;
        console.log('✅ Chart added to scene');

        if (statusText) statusText.textContent = `${appState.data.title || 'Chart'} placed on ground!`;

        if (sideControls) sideControls.style.display = 'flex';
        if (placeBtn) placeBtn.style.display = 'none';

        console.log('=== PLACE CHART COMPLETE ===');

    } catch (error) {
        console.error('Error creating chart:', error);
        alert('⚠️ Error creating chart: ' + error.message);
    }
}

// ==================== Chart Creation Functions ====================
function createBarChart(position) {
    const container = document.createElement('a-entity');
    container.setAttribute('position', `${position.x} ${position.y} ${position.z}`);

    const labels = appState.data.labels;
    const values = appState.data.values;
    const colors = appState.data.colors;

    console.log('Creating bar chart with:', labels.length, 'bars');

    const maxValue = Math.max(...values);
    const spacing = 0.35;
    const barWidth = 0.25;
    const maxHeight = 2.0;

    labels.forEach((label, index) => {
        const normalizedHeight = (values[index] / maxValue) * maxHeight;
        const xPos = (index - (labels.length - 1) / 2) * spacing;

        const bar = document.createElement('a-box');
        bar.setAttribute('width', barWidth);
        bar.setAttribute('height', normalizedHeight);
        bar.setAttribute('depth', barWidth);
        bar.setAttribute('color', colors[index]);
        bar.setAttribute('position', `${xPos} ${normalizedHeight / 2} 0`);
        bar.setAttribute('shadow', 'cast: true');

        bar.setAttribute('animation', {
            property: 'scale',
            from: '1 0.01 1',
            to: '1 1 1',
            dur: 800,
            delay: index * 100,
            easing: 'easeOutCubic'
        });

        const valueText = document.createElement('a-text');
        valueText.setAttribute('value', values[index].toString());
        valueText.setAttribute('align', 'center');
        valueText.setAttribute('color', '#ffffff');
        valueText.setAttribute('width', '1.5');
        valueText.setAttribute('position', `${xPos} ${normalizedHeight + 0.2} 0`);
        valueText.setAttribute('look-at', '[camera]');

        const labelText = document.createElement('a-text');
        labelText.setAttribute('value', label);
        labelText.setAttribute('align', 'center');
        labelText.setAttribute('color', '#ffffff');
        labelText.setAttribute('width', '1.2');
        labelText.setAttribute('position', `${xPos} -0.15 0`);
        labelText.setAttribute('look-at', '[camera]');

        container.appendChild(bar);
        container.appendChild(valueText);
        container.appendChild(labelText);
    });

    if (appState.data.title) {
        const title = document.createElement('a-text');
        title.setAttribute('value', appState.data.title);
        title.setAttribute('align', 'center');
        title.setAttribute('color', '#4A90E2');
        title.setAttribute('width', '3');
        title.setAttribute('position', `0 ${maxHeight + 0.5} 0`);
        title.setAttribute('look-at', '[camera]');
        container.appendChild(title);
    }

    const basePlane = document.createElement('a-plane');
    basePlane.setAttribute('width', labels.length * spacing + 0.5);
    basePlane.setAttribute('height', '0.5');
    basePlane.setAttribute('color', '#16213e');
    basePlane.setAttribute('opacity', '0.3');
    basePlane.setAttribute('position', '0 -0.25 0');
    basePlane.setAttribute('rotation', '-90 0 0');
    container.appendChild(basePlane);

    console.log('✅ Bar chart created with', labels.length, 'bars');
    return container;
}

function createPieChart(position) {
    const container = document.createElement('a-entity');
    container.setAttribute('position', `${position.x} ${position.y} ${position.z}`);

    const values = appState.data.values;
    const labels = appState.data.labels;
    const colors = appState.data.colors;
    const total = values.reduce((sum, val) => sum + val, 0);

    console.log('Creating pie chart with', values.length, 'slices');

    let currentAngle = 0;
    const radius = 0.8;
    const pieHeight = 0.3;

    values.forEach((value, index) => {
        const percentage = value / total;
        const angle = percentage * 360;

        const slice = document.createElement('a-box');
        const sliceAngle = (currentAngle + angle / 2) * (Math.PI / 180);
        const x = Math.cos(sliceAngle) * radius * 0.4;
        const z = Math.sin(sliceAngle) * radius * 0.4;

        slice.setAttribute('width', radius * percentage * 2);
        slice.setAttribute('height', pieHeight);
        slice.setAttribute('depth', radius * 0.4);
        slice.setAttribute('color', colors[index]);
        slice.setAttribute('position', `${x} ${pieHeight / 2} ${z}`);
        slice.setAttribute('rotation', `0 ${currentAngle + angle / 2} 0`);
        slice.setAttribute('shadow', 'cast: true');

        const text = document.createElement('a-text');
        text.setAttribute('value', `${labels[index]}\n${(percentage * 100).toFixed(1)}%`);
        text.setAttribute('align', 'center');
        text.setAttribute('color', '#ffffff');
        text.setAttribute('width', '1.5');
        text.setAttribute('position', `${x * 1.8} ${pieHeight + 0.3} ${z * 1.8}`);
        text.setAttribute('look-at', '[camera]');

        container.appendChild(slice);
        container.appendChild(text);

        currentAngle += angle;
    });

    if (appState.data.title) {
        const title = document.createElement('a-text');
        title.setAttribute('value', appState.data.title);
        title.setAttribute('align', 'center');
        title.setAttribute('color', '#4A90E2');
        title.setAttribute('width', '3');
        title.setAttribute('position', `0 ${pieHeight + 1} 0`);
        title.setAttribute('look-at', '[camera]');
        container.appendChild(title);
    }

    const base = document.createElement('a-circle');
    base.setAttribute('radius', radius * 0.9);
    base.setAttribute('color', '#16213e');
    base.setAttribute('opacity', '0.3');
    base.setAttribute('rotation', '-90 0 0');
    base.setAttribute('position', '0 0.01 0');
    container.appendChild(base);

    container.setAttribute('animation', {
        property: 'rotation',
        to: '0 360 0',
        loop: true,
        dur: 15000,
        easing: 'linear'
    });

    console.log('✅ Pie chart created with', values.length, 'slices');
    return container;
}

function createHistogram(position) {
    return createBarChart(position);
}

// ==================== Chart Manipulation ====================
function rotateChart(degrees) {
    if (!appState.currentChart) return;

    const currentRotation = appState.currentChart.getAttribute('rotation') || { x: 0, y: 0, z: 0 };
    const newY = ((currentRotation.y || 0) + degrees) % 360;

    appState.currentChart.setAttribute('rotation', {
        x: currentRotation.x || 0,
        y: newY,
        z: currentRotation.z || 0
    });

    console.log('Chart rotated to:', newY);
}

function scaleChart(factor) {
    if (!appState.currentChart) return;

    const currentScale = appState.currentChart.getAttribute('scale') || { x: 1, y: 1, z: 1 };

    const newScale = {
        x: currentScale.x * factor,
        y: currentScale.y * factor,
        z: currentScale.z * factor
    };

    if (newScale.x < 0.3 || newScale.x > 3) {
        console.log('Scale limit reached');
        return;
    }

    appState.currentChart.setAttribute('scale', newScale);
    console.log('Chart scaled to:', (newScale.x).toFixed(2));
}

function resetChart() {
    if (!appState.currentChart) return;
    appState.currentChart.setAttribute('rotation', '0 0 0');
    appState.currentChart.setAttribute('scale', '1 1 1');
    console.log('Chart reset to default position and scale');
}

function deleteChart() {
    if (!appState.currentChart) return;

    const chartContainer = document.getElementById('chart-container');
    const placementMarker = document.getElementById('placement-marker');
    const sideControls = document.querySelector('.side-controls');
    const placeBtn = document.getElementById('place-chart-btn');
    const statusText = document.getElementById('status-text');

    if (chartContainer) chartContainer.innerHTML = '';
    appState.currentChart = null;
    console.log('Chart deleted');

    if (placementMarker) placementMarker.setAttribute('visible', true);
    if (sideControls) sideControls.style.display = 'none';
    if (placeBtn) placeBtn.style.display = 'block';
    if (statusText) statusText.textContent = 'Tap "Place Chart" to visualize your data';

    console.log('Ready to place new chart');
}

// ==================== Export for global access ====================
window.initARView = initARView;
