const mongoose  = require('mongoose');

module.exports = [
    {   
        "username" : "jhayg12",
        "fullname" : "Jayson Suyat",
        "email" : "jayson@iscale-solutions.com",
        "password" : "$2b$10$y1T7ycI3I.r9iIrHjS9IouHJBWHnse.oNZ1YjqmFdVr/73aMZ2g8K",
        "role" : new mongoose.Types.ObjectId("5b4be9d61550851c40ae84d2"),
        "status" : 1
    },
    {
        "username" : "jean_emmanuel",
        "fullname" : "Jean Emmanuel Labignette",
        "email" : "jean@iscale-solutions.com",
        "password" : "$2b$10$InkoaRG6YPRfU2s3PCOdxeXgF4.j7VpxzAhn0urdyZuTKROSjrHxG",
        "role" : new mongoose.Types.ObjectId("5b4d8267a83b1d4ff53f55d9"),
        "status" : 1
    }
]