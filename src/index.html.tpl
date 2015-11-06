<!DOCTYPE HTML>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="A cross-platform financial charting application to showcase the functionality of d3fc components">
    <title>d3fc Showcase</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <!-- Version: <%- version %> -->
</head>
<body>
<div class="container" id="app-container">
    <div class="row row-offcanvas-right head-menu head-row">
        <div class="col-xs-12 col-sm-12 col-md-9 head-sub-row">
            <div id="product-dropdown" class="dropdown">
                <button id="product-dropdown-button" class="dropdown-toggle" type="button" data-toggle="dropdown"></button>
            </div>
            <div id="reset-button">
                <button class="btn btn-default" type="button">Reset</button>
            </div>
            <div id="period-selector"></div>
        </div>
        <div class="col-xs-4 col-sm-4 col-md-3 sidebar-offcanvas">
        </div>
    </div>
    <div class="row row-offcanvas-right primary-row">
        <div class="col-xs-12 col-sm-12 col-md-9 col-chart">
            <div id="legend"></div>
            <div id="charts-container">
                <div id="primary-container"></div>
                <div class="secondary-container"></div>
                <div class="secondary-container"></div>
                <div class="secondary-container"></div>
                <div id="x-axis-row">
                    <svg id="x-axis-container"></svg>
                </div>
                <div id="navbar-row">
                    <div id="navbar-container"></div>
                </div>
            </div>
        </div>
        <div class="col-xs-4 col-sm-4 col-md-3 sidebar-offcanvas sidebar-menu">
            <div class="series-buttons btn-group"></div>
            <div class="y-value-accessor-buttons btn-group"></div>
            <div class="indicator-buttons btn-group"></div>
            <div class="secondary-chart-buttons btn-group"></div>
        </div>
    </div>
</div>
<script src="<%- appJsPath %>"></script>
<%= liveReload === true ? '<script src="//localhost:35729/livereload.js"></script>' : '' %>
</body>
</html>
