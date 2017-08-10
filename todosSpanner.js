'use strict';

var projectId = process.env.GAE_LONG_APP_ID || process.env.PROJECT_ID;
var instanceId = process.env.SPANNER_ID

if (!projectId) {
  var MISSING_ID = [
    'Cannot find your project ID. Please set an environment variable named ',
    '"PROJECT_ID", holding the ID of your project.'
  ].join('');
  throw new Error(MISSING_ID);
}

if (!instanceId) {
  var MISSING_ID = [
    'Cannot find your Spanner Instance ID. Please set an environment variable named ',
    '"SPANNER_ID", holding the ID of your Spanner Instance.'
  ].join('');
  throw new Error(MISSING_ID);
}

const Spanner = require('@google-cloud/spanner');
const spanner = Spanner({
  projectId: projectId,
});
const instance = spanner.instance(instanceId);
const database = instance.database('tododb');

const table = database.table('Todo');

/*
  Handles the Spanner mapping of the entity object 
  Specificially to get the id value from the object

 */
function entityToTodo(entity) {
  var entityJson = entity.toJSON();
  var key = entityJson.id.value;

  entityJson.id = key;
  
  return entityJson;
}

module.exports = {
  // Delete a row based on the id
  //
  delete: function(id, callback) {
    table.deleteRows(id, function(err, response) {
          callback(err || null);
    });
  },

  // Deleted all completed todos
  //
  deleteCompleted: function(callback) {
    const query = {
      sql: 'SELECT id, completed, title FROM Todo WHERE completed is TRUE'
    };

    database.run(query).then((results) => { 
      const rows = results[0];

      rows.forEach((row) => {
        const json = row.toJSON();
        table.deleteRows(json.id.value)
      })

      callback(null);
    })
  },

  // Gets a specific todo
  //
  get: function(id, callback) {
    const query = {
      columns: ['id', 'completed', 'title'],
      keySet: {
        key: [id]
      }      
    };
    table.read(query).then((results) => {
      const rows = results[0];
      callback(null, rows);
    })
  },

  // Gets all todos
  //
  getAll: function(callback) {
    const query = {
      columns: ['id', 'completed', 'title'],
      keySet: {
        all: true
      }      
    };
    table.read(query).then((results) => {
      const rows = results[0];  
      
      callback(null, rows.map(entityToTodo));
    })
  },

  // Inserts a new todo item
  //
  insert: function(data, callback) {
    data.completed=false;
    // Random Number between 1 - 1000
    //
    data.id = Math.floor((Math.random() * 1000) + 1);

    table.insert(data).then(() => { console.log('inserted data')});
    
    callback(null, data);
  },

  // Updates the todo item
  //
  update: function(id, data, callback) {
    table.update(data).then(() => { console.log('updated data')});
    
    callback(null, data);
  }
};