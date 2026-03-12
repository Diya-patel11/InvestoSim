const bcrypt = require("bcrypt");

// Simulated raw password (use the actual password you entered during registration)
const enteredPassword = "diyapatel123";

// Hashed password from MongoDB (replace with the actual stored hash)
const storedHash = "$2a$10$a9prbhol9vU46iSQcv0Es.tKYSL4I61PXnZ1e9bJdNFAH3rv74JNe";

// Compare the entered password with the stored hash
bcrypt.compare(enteredPassword, storedHash, (err, result) => {
    if (err) {
        console.error("Error comparing passwords:", err);
    } else {
        console.log("Password Match:", result);
    }
});
