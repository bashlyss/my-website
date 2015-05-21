'use strict';

/*
 Put any interaction code here
 */

var activityModel = new ActivityStoreModel();
var activityTypeModel = new ActivityTypeModel();
var graphModel = new GraphModel();
var energyCheck = true;
var stressCheck = true;
var happinessCheck = true;

window.addEventListener('load', function() {
    // You should wire up all of your event handling code here, as well as any
    // code that initiates calls to manipulate the DOM (as opposed to responding
    // to events)
    console.log("Loading uTrack");

    var analysis_div = document.getElementById('analysis_div');
    analysis_div.style.display = 'none';

    displayInput();

    var form = document.getElementById('input_form');
    form.addEventListener('submit', function() {
        try {
            var activityData = new ActivityData(
                document.getElementById('input_activity').value,
                {
                    energyLevel: getIntValueById('input_energy'),
                    stressLevel: getIntValueById('input_stress'),
                    happinessLevel: getIntValueById('input_happiness')
                },
                getIntValueById('input_time')
            );
            activityModel.addActivityDataPoint(activityData);
        }
        catch (badField)
        {
            var message = 'Input is not a number for field \'' + badField + '\'';
            alert(message);
        }
        event.preventDefault();
    });

    var input_activity_type = document.getElementById('input_activity');
    _.each(activityTypeModel.getActivityTypes(), function (activityType) {
        var option = document.createElement('option');
        option.innerText = activityType;
        input_activity_type.appendChild(option);
    });

    var input_button = document.getElementById('input_button');
    input_button.addEventListener('click', function() {
        var input_div = document.getElementById('input_div');
        input_div.style.display = 'block';
        var analysis_div = document.getElementById('analysis_div');
        analysis_div.style.display = 'none';
    });

    var analysis_button = document.getElementById('analysis_button');
    analysis_button.addEventListener('click', function() {
        var input_div = document.getElementById('input_div');
        input_div.style.display = 'none';
        var analysis_div = document.getElementById('analysis_div');
        analysis_div.style.display = 'block';
    });

    var view_select_form = document.getElementById('view_select_form');
    var view_options = graphModel.getAvailableGraphNames();
    var first = true;
    view_options.forEach(function (name) {
        var label = document.createElement('label');
        label.className = 'radio'

        var input = document.createElement('input');
        input.type='radio';
        input.name='view_select';
        input.value=name;
        if (first)
        {
            first = false;
            input.checked = true;
        }
        label.appendChild(input);

        var span = document.createElement('span');
        span.innerText = name;
        label.appendChild(span);

        view_select_form.appendChild(label);

    });

    var inputRadios = document.getElementsByName('view_select')
    for (var i = 0; i < inputRadios.length; i++)
    {
        inputRadios[i].addEventListener('click', function (e) {graphModel.selectGraph(e.target.value)});
    }

    // Respond to events
    activityModel.addListener( function(eventType, eventTime, eventData)
    {
        if (eventType === ACTIVITY_DATA_ADDED_EVENT || eventType === ACTIVITY_DATA_REMOVED_EVENT)
        {
            createTableSummary(activityModel.getActivityDataPoints());
            createScatterplot(activityModel.getActivityDataPoints(), energyCheck, stressCheck, happinessCheck);
        }
    });

    activityModel.addListener( function (eventType, eventTime, eventData) {
        if (eventType === ACTIVITY_DATA_ADDED_EVENT)
        {
            var time_span = document.getElementById('last_data_time');
            time_span.innerHTML = eventTime;
        }
    });

    graphModel.addListener( function (eventType, eventTime, eventData) {
        if (eventType === GRAPH_SELECTED_EVENT)
        {
            if (eventData === 'table summary')
            {
                displayTableSummary();
                hideScatterplot()
            }
            else if (eventData === 'scatterplot')
            {
                displayScatterplot();
                hideTableSummary();
            }
        }
    });

    graphModel.selectGraph('table summary');

    activityTypeModel.addListener (function (eventType, eventData) {
        if (eventType = ACTIVITY_TYPE_ADDED_EVENT) {
            var input_activity_type = document.getElementById('input_activity');
            var option = document.createElement('option');
            option.innerText = eventData;
            input_activity_type.appendChild(option);
            input_activity_type.value = eventData;

        }
    });

    var form_plot = document.getElementById('input_customize_plot');
    form_plot.addEventListener('submit', function() {
        energyCheck = document.getElementById('check_energy').checked;
        stressCheck = document.getElementById('check_stress').checked;
        happinessCheck = document.getElementById('check_happiness').checked;
        createScatterplot(activityModel.getActivityDataPoints(), energyCheck, stressCheck, happinessCheck);
        event.preventDefault();
    })
});

/*
 * This function retrieves an element from the page based on its id and checks
 * that it is an integer
 */
function getIntValueById(id) {
    var value = document.getElementById(id).value;
    if (!isNaN(parseFloat(value)) && isFinite(value))
    {
        return parseFloat(value);
    }
    else
    {
        throw document.getElementById(id).name;
    }
}