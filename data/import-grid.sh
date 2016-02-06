echo "Joey's Data to MongoDB"
node geojson2mongo.js co2webdb co2grid gridded-emissions-100m.geojson --drop
exit
