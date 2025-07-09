# HE11T Booster Tool - Copy Protection System

[🇸🇦 العربية](PROTECTION_AR.md) | [🇺🇸 English](PROTECTION.md)

## 🛡️ **Copy Protection Features**

### **1. Tool Binding**
- **Installation Locking**: Tool is bound to its original installation location
- **Machine Fingerprinting**: Creates unique machine ID based on hardware
- **Path Verification**: Checks if tool is in its original directory
- **Prevents**: Moving or copying the tool to other locations

### **2. Integrity Protection**
- **File Integrity**: Monitors critical files for modifications
- **Hash Verification**: SHA-256 hash checking of all critical files
- **Tool ID Generation**: Creates unique tool identifier on first run
- **Modification Detection**: Detects unauthorized file changes
- **Auto-Block**: Exits if integrity is compromised
- **Continuous Monitoring**: Real-time file monitoring during runtime

### **3. Data Encryption**
- **AES-256-CBC Encryption**: All sensitive data encrypted
- **Tool-Specific Keys**: Encryption keys based on tool installation
- **Encrypted Storage**: 
  - `accounts.enc` - Encrypted account data
  - `servers.enc` - Encrypted server data
  - `.toolid` - Tool identification file
  - `tool.log` - Encrypted activity logs

### **4. Token Security**
- **Format Validation**: Validates Discord token format
- **Input Sanitization**: Removes dangerous characters
- **Secure Storage**: Tokens encrypted before saving

### **5. Activity Logging**
- **Encrypted Logs**: All activity logged and encrypted
- **Event Tracking**: 
  - Tool initialization
  - Account operations
  - Data saves/loads
  - Protection violations
- **Audit Trail**: Complete activity history

## 🔒 **How It Works**

### **First Run**
1. Tool generates unique machine fingerprint
2. Creates tool ID based on installation location
3. Stores encrypted tool ID in `.toolid` file
4. Tool is now bound to this location

### **Subsequent Runs**
1. Verifies tool ID matches current location
2. Checks critical files exist and haven't been modified
3. Validates machine fingerprint
4. Compares file hashes with stored values
5. Loads encrypted data if integrity is confirmed
6. Starts continuous monitoring during runtime

### **Copy Protection**
- **Location Binding**: Tool only works in original directory
- **Machine Locking**: Tied to specific hardware configuration
- **File Monitoring**: Detects file modifications or deletions
- **Auto-Exit**: Stops execution if protection is bypassed

## 🚫 **What It Prevents**

### **Tool Copying**
- ✅ Cannot be copied to other folders
- ✅ Cannot be moved to different locations
- ✅ Cannot be shared between machines
- ✅ Cannot be run from USB drives

### **Data Theft**
- ✅ All data encrypted with tool-specific keys
- ✅ Encrypted data cannot be read without the tool
- ✅ Tokens and accounts protected
- ✅ Activity logs encrypted

### **Modification**
- ✅ Critical files monitored for changes
- ✅ Tool ID prevents tampering
- ✅ Integrity checks on startup
- ✅ Auto-block on violations

## 📋 **Protection Files**

### **Generated Files**
- `.toolid` - Tool identification and binding
- `.filehashes` - File integrity hashes
- `accounts.enc` - Encrypted account data
- `servers.enc` - Encrypted server data
- `tool.log` - Encrypted activity logs

### **Critical Files**
- `index.js` - Main application
- `utils.js` - Utility functions
- `protection.js` - Protection system
- `package.json` - Dependencies

## ⚠️ **Important Notes**

### **Tool Usage**
- Tool must stay in original installation directory
- Cannot be moved or copied to other locations
- Requires all critical files to be present
- Machine configuration must remain consistent

### **Data Safety**
- All data automatically encrypted
- Tool-specific encryption keys
- Secure token handling
- Protected against data extraction

### **Sharing Prevention**
- Tool cannot be shared with others
- Bound to specific machine and location
- Copy protection prevents distribution
- Each installation is unique

## 🚨 **Protection Alerts**

The tool will automatically detect and respond to:
- Tool being moved to different location
- Critical files missing or modified
- Machine configuration changes
- Attempts to copy or share the tool
- Data corruption or tampering
- **File modifications during runtime** (immediate shutdown)
- **Hash mismatches** (program termination)
- **Missing critical files** (forced exit)
- **Any bypass attempts** (permanent lock)

## ⚠️ **Important Security Notes**

### **No Reset Available**
- **Permanent Binding**: Once installed, tool is permanently bound to location
- **No Bypass**: No reset or debug commands available
- **Security First**: Protection cannot be disabled or bypassed
- **Contact Support**: Only legitimate issues should be reported

### **Tool Usage**
- Tool must stay in original installation directory
- Cannot be moved or copied to other locations
- Requires all critical files to be present
- Machine configuration must remain consistent

---

**HE11T Booster Tool v1.0 - Copy Protected Edition** 