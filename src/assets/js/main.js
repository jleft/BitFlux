import app from './app';
import initialiseModel from './initialiseModel';

var model = initialiseModel();
app(model).run();
