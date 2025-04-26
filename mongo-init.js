db = db.getSiblingDB('admin');
db.auth('admin', 'secret123');

// Create flight-search database and user
db = db.getSiblingDB('flight-search');
db.createUser({
  user: 'admin',
  pwd: 'secret123',
  roles: [{ role: 'readWrite', db: 'flight-search' }]
});

// Create flight_booking database and user
db = db.getSiblingDB('flight_booking');
db.createUser({
  user: 'admin',
  pwd: 'secret123',
  roles: [{ role: 'readWrite', db: 'flight_booking' }]
});

// Create visa-service database and user
db = db.getSiblingDB('visa-service');
db.createUser({
  user: 'admin',
  pwd: 'secret123',
  roles: [{ role: 'readWrite', db: 'visa-service' }]
}); 