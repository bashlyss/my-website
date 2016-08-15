'use strict';

// Put your view code here (e.g., the graph renderering code)

var AbstractView = function () {
};

_.extend(AbstractView.prototype, {
    _instantiateInterface: function (templateId, attachToElement, newId) {
        var template = document.getElementById(templateId);
        this.hostElement = document.createElement('div');
        this.hostElement.innerHTML = template.innerHTML;
        attachToElement.appendChild(this.hostElement);
    }
});

var RemoveDataButton = function (attachToElement, data) {
    this._instantiateInterface('remove_data_button_template', attachToElement);

    var removeButton = this.hostElement.getElementsByClassName('remove_button')[0];
    removeButton.addEventListener('click', function () {
        activityModel.removeActivityDataPoint(data);
    });
};
_.extend(RemoveDataButton.prototype, AbstractView.prototype);

var AddActivityButton = function (attachToElement) {
    this._instantiateInterface('add_activity_button_template', attachToElement);

    var addButton = this.hostElement.getElementsByClassName('add_button')[0];
    addButton.addEventListener('click', function () {
        var activityType = prompt("Please enter a new activity type");
        if (activityType)
        {
            activityTypeModel.addActivityType(activityType);
        }
        event.preventDefault();
    });
};
_.extend(AddActivityButton.prototype, AbstractView.prototype);


/*
 * Should create and display the table summarizing activities and time spent
 * @param array of ActivityData
 */
function createTableSummary (data)
{
    var tbody = document.getElementById('table_summary');
    tbody.innerHTML = '';

    data.forEach(function(dataPoint) {
        var tr = document.createElement('tr');
        var td1 = document.createElement('td');
        td1.innerText = dataPoint.activityType;
        tr.appendChild(td1);
        var td2 = document.createElement('td');
        td2.innerText = dataPoint.activityDurationInMinutes;
        tr.appendChild(td2);
        var removeButton = new RemoveDataButton(tr, dataPoint);
        tbody.appendChild(tr);
    });
}

function displayTableSummary()
{
    var table = document.getElementById('time_table');
    table.style.display = 'block';
}

function hideTableSummary()
{
    var table = document.getElementById('time_table');
    table.style.display = 'none';
}

function createScatterplot (data, energy, stress, happiness)
{
    var canvas = document.getElementById('scatterplot_canvas');
    var context = canvas.getContext('2d');

    var width = canvas.width;
    var height = canvas.height;

    var radius = 3;

    var points = data.length;
    var fontSize = Math.min(12, Math.floor(height/points));

    context.clearRect(0, 0, width, height);

    context.font = fontSize + 'px Arial';

    var itemNumber = 0;

    var max = 1;

    data.forEach(function(dataPoint) {
        max = Math.max(max, dataPoint.activityDataDict['energyLevel']);
        max = Math.max(max, dataPoint.activityDataDict['stressLevel']);
        max = Math.max(max, dataPoint.activityDataDict['happinessLevel']);
    });

    data.forEach(function (dataPoint) {
        context.fillText(dataPoint.activityType, 2, Math.floor((height-fontSize)/points)*itemNumber + fontSize, width/4-4);

        context.beginPath();
        context.moveTo(width/4, 0);
        context.lineTo(width/4, height);
        context.stroke();

        if(energy)
        {
            context.beginPath();
            context.arc((dataPoint.activityDataDict.energyLevel/max)*(width-width/4-radius)+width/4, Math.floor((height-fontSize)/points)*itemNumber + fontSize/2, radius, 0, 2*Math.PI);
            context.stroke();
        }

        if (stress)
        {
            var stressLevel = dataPoint.activityDataDict.stressLevel;
            context.beginPath();
            context.moveTo((stressLevel/max)*(width-width/4-radius)+width/4, Math.floor((height-fontSize)/points)*itemNumber + fontSize/2 + radius);
            context.lineTo((stressLevel/max)*(width-width/4-radius)+width/4, Math.floor((height-fontSize)/points)*itemNumber + fontSize/2 - radius);
            context.stroke();

            context.beginPath();
            context.moveTo((stressLevel/max)*(width-width/4-radius)+width/4+radius, Math.floor((height-fontSize)/points)*itemNumber + fontSize/2);
            context.lineTo((stressLevel/max)*(width-width/4-radius)+width/4-radius, Math.floor((height-fontSize)/points)*itemNumber + fontSize/2);
            context.stroke();
        }

        if (happiness)
        {
            var happinessLevel = dataPoint.activityDataDict.happinessLevel;
            context.beginPath();
            context.moveTo((happinessLevel/max)*(width-width/4-radius)+width/4+radius, Math.floor((height-fontSize)/points)*itemNumber + fontSize/2 + radius);
            context.lineTo((happinessLevel/max)*(width-width/4-radius)+width/4-radius, Math.floor((height-fontSize)/points)*itemNumber + fontSize/2 - radius);
            context.stroke();

            context.beginPath();
            context.moveTo((happinessLevel/max)*(width-width/4-radius)+width/4+radius, Math.floor((height-fontSize)/points)*itemNumber + fontSize/2 - radius);
            context.lineTo((happinessLevel/max)*(width-width/4-radius)+width/4-radius, Math.floor((height-fontSize)/points)*itemNumber + fontSize/2 + radius);
            context.stroke();
        }
        itemNumber++;
    });
}

function displayScatterplot()
{
    var plot = document.getElementById('scatterplot_div');
    plot.style.display = 'block';
}

function hideScatterplot()
{
    var plot = document.getElementById('scatterplot_div');
    plot.style.display = 'none';
}

function displayInput()
{
    var activityDiv = document.getElementById('input_activity_div')
    new AddActivityButton(activityDiv);
}