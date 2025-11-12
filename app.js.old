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

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the main page or AR page
    if (document.querySelector('.container')) {
        initMainPage();
    } else if (document.querySelector('.ar-body')) {
        // AR page will be initialized separately
        console.log('AR page loaded');
    }
});

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
        btn.addEventListener('click', () => {
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
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            appState.inputMethod = btn.dataset.method;
            
            if (appState.inputMethod === 'manual') {
                manualInput.style.display = 'block';
                sampleInput.style.display = 'none';
            } else {
                manualInput.style.display = 'none';
                sampleInput.style.display = 'block';
                loadSampleData();
            }
            
            updatePreview();
        });
    });
    
    // Load sample data by default if sample method is active
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
    
    // Manual input listeners
    labelsInput?.addEventListener('input', () => {
        appState.data.labels = labelsInput.value.split(',').map(l => l.trim()).filter(l => l);
        updatePreview();
    });
    
    valuesInput?.addEventListener('input', () => {
        appState.data.values = valuesInput.value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
        updatePreview();
    });
    
    titleInput?.addEventListener('input', () => {
        appState.data.title = titleInput.value;
        updatePreview();
    });
    
    // Sample data selector
    sampleSelect?.addEventListener('change', () => {
        loadSampleData();
        updatePreview();
    });
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
    for (let i = 0; i < count; i++) {
        colors.push(COLORS[i % COLORS.length]);
    }
    return colors;
}

function updatePreview() {
    const previewContent = document.getElementById('preview-content');
    
    if (appState.data.labels.length === 0 || appState.data.values.length === 0) {
        previewContent.innerHTML = '<p class="placeholder">Data akan muncul di sini...</p>';
        return;
    }
    
    // Ensure colors are generated
    if (appState.data.colors.length !== appState.data.values.length) {
        appState.data.colors = generateColors(appState.data.values.length);
    }
    
    let html = '<table>';
    html += '<thead><tr><th>Label</th><th>Value</th><th>Color</th></tr></thead>';
    html += '<tbody>';
    
    for (let i = 0; i < Math.min(appState.data.labels.length, appState.data.values.length); i++) {
        const color = appState.data.colors[i] || COLORS[0];
        html += `<tr>
            <td>${appState.data.labels[i]}</td>
            <td>${appState.data.values[i]}</td>
            <td><span style="display:inline-block;width:20px;height:20px;background:${color};border-radius:4px;"></span></td>
        </tr>`;
    }
    
    html += '</tbody></table>';
    previewContent.innerHTML = html;
}

function setupLaunchButton() {
    const launchBtn = document.getElementById('launch-ar-btn');
    
    launchBtn?.addEventListener('click', () => {
        console.log('Launch AR button clicked');
        console.log('Current state:', appState);
        
        // Validate data
        if (appState.data.labels.length === 0 || appState.data.values.length === 0) {
            alert('⚠️ Silakan input data terlebih dahulu!');
            return;
        }
        
        if (appState.data.labels.length !== appState.data.values.length) {
            alert('⚠️ Jumlah labels dan values harus sama!');
            return;
        }
        
        // Ensure colors are generated
        if (appState.data.colors.length === 0) {
            appState.data.colors = generateColors(appState.data.values.length);
        }
        
        // Save to localStorage
        const dataToSave = {
            type: appState.chartType,
            data: appState.data
        };
        
        console.log('Saving data to localStorage:', dataToSave);
        localStorage.setItem('arChartData', JSON.stringify(dataToSave));
        
        // Verify save
        const saved = localStorage.getItem('arChartData');
        console.log('Verified saved data:', saved);
        
        // Navigate to AR view
        console.log('Navigating to ar.html');
        window.location.href = 'ar.html';
    });
}

// ==================== AR View Logic ====================
function initARView() {
    console.log('=== INIT AR VIEW START ===');
    
    // Load saved data
    const savedData = localStorage.getItem('arChartData');
    console.log('Raw saved data:', savedData);
    
    if (!savedData) {
        console.error('No data found in localStorage');
        alert('⚠️ No data found. Redirecting to input page...');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        return;
    }
    
    try {
        const chartData = JSON.parse(savedData);
        console.log('Parsed chart data:', chartData);
        
        appState.chartType = chartData.type;
        appState.data = chartData.data;
        
        console.log('Chart type:', appState.chartType);
        console.log('Chart data:', appState.data);
        console.log('Labels:', appState.data.labels);
        console.log('Values:', appState.data.values);
        
        // Ensure colors exist
        if (!appState.data.colors || appState.data.colors.length === 0) {
            appState.data.colors = generateColors(appState.data.values.length);
            console.log('Generated colors:', appState.data.colors);
        }
        
        setupARControls();
        console.log('✅ AR controls setup complete');
        
        setupWebXR();
        console.log('✅ WebXR setup complete');
        
        console.log('=== INIT AR VIEW COMPLETE ===');
    } catch (error) {
        console.error('Error in initARView:', error);
        alert('⚠️ Error loading data: ' + error.message);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
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
    
    backBtn?.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    placeBtn?.addEventListener('click', () => {
        placeChartOnGround();
    });
    
    rotateLeftBtn?.addEventListener('click', () => {
        rotateChart(-15);
    });
    
    rotateRightBtn?.addEventListener('click', () => {
        rotateChart(15);
    });
    
    scaleUpBtn?.addEventListener('click', () => {
        scaleChart(1.2);
    });
    
    scaleDownBtn?.addEventListener('click', () => {
        scaleChart(0.8);
    });
    
    resetBtn?.addEventListener('click', () => {
        resetChart();
    });
    
    deleteBtn?.addEventListener('click', () => {
        deleteChart();
    });
    
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
    
    // Show placement marker on ground
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
    
    // Hide placement marker
    if (placementMarker) {
        placementMarker.setAttribute('visible', false);
        console.log('✅ Placement marker hidden');
    }
    
    // Ground position (Y = 0 is ground level)
    const groundPosition = { x: 0, y: 0, z: -2 };
    console.log('Chart will be placed at ground position:', groundPosition);
    
    // Create chart based on type
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
        
        // Add chart to container
        chartContainer.innerHTML = ''; // Clear any existing chart
        chartContainer.appendChild(chart);
        appState.currentChart = chart;
        console.log('✅ Chart added to scene');
        
        // Update UI
        if (statusText) {
            statusText.textContent = `${appState.data.title || 'Chart'} placed on ground!`;
        }
        
        if (sideControls) {
            sideControls.style.display = 'flex';
            console.log('✅ Side controls shown');
        }
        
        if (placeBtn) {
            placeBtn.style.display = 'none';
            console.log('✅ Place button hidden');
        }
        
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
    
    // Normalize values
    const maxValue = Math.max(...values);
    const spacing = 0.35;
    const barWidth = 0.25;
    const maxHeight = 2.0; // Maximum bar height
    
    labels.forEach((label, index) => {
        const normalizedHeight = (values[index] / maxValue) * maxHeight;
        const xPos = (index - labels.length / 2) * spacing;
        
        // Create bar - positioned so bottom is at Y=0 (ground)
        const bar = document.createElement('a-box');
        bar.setAttribute('width', barWidth);
        bar.setAttribute('height', normalizedHeight);
        bar.setAttribute('depth', barWidth);
        bar.setAttribute('color', colors[index]);
        bar.setAttribute('position', `${xPos} ${normalizedHeight / 2} 0`); // Y = height/2 so bottom touches ground
        bar.setAttribute('shadow', 'cast: true');
        
        // Add animation - grow from ground up
        bar.setAttribute('animation', {
            property: 'scale',
            from: '1 0.01 1',
            to: '1 1 1',
            dur: 800,
            delay: index * 100,
            easing: 'easeOutCubic'
        });
        
        // Add value label on top of bar
        const valueText = document.createElement('a-text');
        valueText.setAttribute('value', values[index].toString());
        valueText.setAttribute('align', 'center');
        valueText.setAttribute('color', '#ffffff');
        valueText.setAttribute('width', '1.5');
        valueText.setAttribute('position', `${xPos} ${normalizedHeight + 0.2} 0`);
        valueText.setAttribute('look-at', '[camera]');
        
        // Add label at ground level
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
    
    // Add chart title above everything
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
    
    // Add ground reference plane under chart
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
    const pieHeight = 0.3; // Height of pie above ground
    
    values.forEach((value, index) => {
        const percentage = value / total;
        const angle = percentage * 360;
        
        // Create slice (simplified as wedge)
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
        
        // Add label with percentage
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
    
    // Add title above pie
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
    
    // Add base circle on ground
    const base = document.createElement('a-circle');
    base.setAttribute('radius', radius * 0.9);
    base.setAttribute('color', '#16213e');
    base.setAttribute('opacity', '0.3');
    base.setAttribute('rotation', '-90 0 0');
    base.setAttribute('position', '0 0.01 0');
    container.appendChild(base);
    
    // Add rotation animation
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
    // Similar to bar chart but with continuous bins
    return createBarChart(position);
}

// ==================== Chart Manipulation ====================
function rotateChart(degrees) {
    if (!appState.currentChart) return;
    
    const currentRotation = appState.currentChart.getAttribute('rotation');
    const newY = (currentRotation.y + degrees) % 360;
    
    appState.currentChart.setAttribute('rotation', {
        x: currentRotation.x,
        y: newY,
        z: currentRotation.z
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
    
    // Limit scale between 0.3 and 3
    if (newScale.x < 0.3 || newScale.x > 3) {
        console.log('Scale limit reached');
        return;
    }
    
    appState.currentChart.setAttribute('scale', newScale);
    console.log('Chart scaled to:', newScale.x.toFixed(2));
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
    
    // Remove chart
    chartContainer.innerHTML = '';
    appState.currentChart = null;
    console.log('Chart deleted');
    
    // Show placement marker again
    if (placementMarker) {
        placementMarker.setAttribute('visible', true);
    }
    
    if (sideControls) {
        sideControls.style.display = 'none';
    }
    
    if (placeBtn) {
        placeBtn.style.display = 'block';
    }
    
    if (statusText) {
        statusText.textContent = 'Tap "Place Chart" to visualize your data';
    }
    
    console.log('Ready to place new chart');
}

// ==================== Export for global access ====================
window.initARView = initARView;