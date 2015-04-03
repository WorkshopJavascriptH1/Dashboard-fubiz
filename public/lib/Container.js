var Container = {
    apiUrl: "http://fubizstats-api.herokuapp.com"
};



Container.loadUsers = function () {
    $.get(Container.apiUrl +'/users', Container.caughtUsers);
};


Container.loadUsersBack = function () {
    $('#loading').show();
    Container.loadUsers();
};


Container.loadInfosUser = function () {
    $('#loading').show();

    var username = $(this).attr('data-infos');
    var date = new Date();
    var day = (date.getDate() > 9) ? date.getDate() : "0"+ date.getDate();
    var month = (date.getMonth() > 9) ? (date.getMonth() + 1) : "0"+ (date.getMonth() + 1);
    var year = date.getFullYear();
    var dateFormatted = year +"-"+ month +"-"+ day;

    $.get(Container.apiUrl +"/stats/"+ username +"/"+ dateFormatted, Container.caughtInfosUser);
};


Container.changeDateInfosUser = function () {
    var dateFormatted = $(this).val();
    var username = $("#usersInfos").val();

    $.get(Container.apiUrl +"/stats/"+ username +"/"+ dateFormatted, Container.caughtChartUser);
};


Container.caughtUsers = function (response) {
    if (response.code != 200) {
        alert(response.message);
        return false;
    }

    Container.loadTemplate('users.hbs', {users: response.result}, function (templateCompiled) {
        $('#container').html(templateCompiled);
        $('#loading').hide();
    });
};


Container.caughtInfosUser = function (response) {
    if (response.code != 200) {
        alert(response.message);
        return false;
    }

    Container.loadTemplate('infos.hbs', {users: response.result}, function (templateCompiled) {
        $('#container').html(templateCompiled);
        $('#loading').hide();

        Container.updateChart(response.result);
    });
};


Container.caughtChartUser = function (response) {
    if (response.code != 200) {
        alert(response.message);
        return false;
    }

    Container.updateChart(response.result);
};


/**
 * Met a jour le chart (comparaison users etc)
 *
 */
Container.updateChart = function (users) {
    var finalDatas = [];
    var finalLabels = [];
    var basicDatasOpt = {
        label: "My First dataset",
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: []
    };
    var i = 0;

    for (user in users) {
        var currentUser = users[user];
        var datas = currentUser.stats;
        var j = 0;

        // On set les global config
        finalDatas[i] = basicDatasOpt;
        finalDatas[i].label = user;

        for (day in datas) {
            var currentDate = datas[day];

            for (hour in currentDate) {
                var currentData = currentDate[hour]
                
                finalLabels[j] = hour +"h";
                finalDatas[i].data[j] = currentData.votes;

                j++;
            }
        }

        i++;
    }

    $('#statsContainer').html('<canvas id="stats" width="1140" height="500"></canvas>');
    var canvas = $('#stats').get(0).getContext('2d');
    var chart = new Chart(canvas).Line({
        labels: finalLabels,
        datasets: finalDatas
    });
};


Container.loadTemplate = function (template, params, callback) {
    $.get('templates/'+ template, function (templateContent) {
        var templateCompiled = Handlebars.compile(templateContent);
        templateCompiled = templateCompiled(params);

        callback(templateCompiled);
    });
};
