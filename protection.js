const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const chalk = require('chalk');

class CopyProtection {
    constructor() {
        this.machineId = this.generateMachineId();
        this.toolId = this.generateToolId();
        this.isValid = false;
    }

    generateMachineId() {
        const components = [
            os.hostname(),
            os.platform(),
            os.arch(),
            os.cpus()[0].model,
            Math.floor(os.totalmem() / (1024 * 1024 * 1024)).toString(), // RAM in GB (rounded)
            process.env.USERNAME || process.env.USER || 'unknown'
        ];
        return crypto.createHash('sha256').update(components.join('')).digest('hex');
    }

    generateToolId() {
        // Generate unique tool ID based on installation (completely stable)
        const toolComponents = [
            __dirname,
            this.machineId
        ];
        return crypto.createHash('sha256').update(toolComponents.join('')).digest('hex');
    }

    async checkToolIntegrity() {
        console.log(chalk.cyan('[PROTECTION] Verifying tool integrity...'));
        
        try {
            // Check if tool ID file exists
            if (!fs.existsSync('./.toolid')) {
                // First time running - create tool ID
                console.log(chalk.yellow('[PROTECTION] First time running - creating tool ID...'));
                await this.createToolId();
                return true;
            }

            // Read existing tool ID
            const storedToolData = JSON.parse(fs.readFileSync('./.toolid', 'utf8'));
            
            // Check if tool ID matches current machine
            if (storedToolData.toolId !== this.toolId) {
                console.log(chalk.red('[PROTECTION] Tool integrity compromised!'));
                console.log(chalk.red('[PROTECTION] This tool is bound to its original installation.'));
                console.log(chalk.red('[PROTECTION] Program terminated for security.'));
                this.forceExit();
                return false;
            }

            // Check if critical files exist and get their hashes
            const criticalFiles = ['index.js', 'utils.js', 'protection.js', 'package.json'];
            const fileHashes = {};
            
            for (const file of criticalFiles) {
                if (!fs.existsSync(file)) {
                    console.log(chalk.red(`[PROTECTION] Critical file missing: ${file}`));
                    this.forceExit();
                    return false;
                }
                
                // Calculate file hash
                const content = fs.readFileSync(file, 'utf8');
                fileHashes[file] = crypto.createHash('sha256').update(content).digest('hex');
            }

            // Check if we have stored hashes
            if (fs.existsSync('./.filehashes')) {
                const storedHashes = JSON.parse(fs.readFileSync('./.filehashes', 'utf8'));
                
                // Compare current hashes with stored hashes
                for (const [file, storedHash] of Object.entries(storedHashes)) {
                    if (fileHashes[file] && fileHashes[file] !== storedHash) {
                        console.log(chalk.red('[PROTECTION] File modification detected!'));
                        console.log(chalk.red('[PROTECTION] Program terminated for security.'));
                        this.forceExit();
                        return false;
                    }
                }
            } else {
                // First time - store current hashes
                fs.writeFileSync('./.filehashes', JSON.stringify(fileHashes, null, 2));
            }

            // Additional integrity check - verify tool ID file content
            if (storedToolData.machineId !== this.machineId) {
                console.log(chalk.red('[PROTECTION] Machine ID mismatch detected!'));
                console.log(chalk.red('[PROTECTION] This tool is bound to its original machine.'));
                console.log(chalk.red('[PROTECTION] Program terminated for security.'));
                this.forceExit();
                return false;
            }

            this.isValid = true;
            console.log(chalk.green('[PROTECTION] Tool integrity verified!'));
            return true;

        } catch (error) {
            console.log(chalk.red('[PROTECTION] Integrity check failed:', error.message));
            this.forceExit();
            return false;
        }
    }

    async createToolId() {
        try {
            const toolData = {
                toolId: this.toolId,
                machineId: this.machineId,
                installDate: new Date().toISOString(),
                installPath: __dirname
            };

            fs.writeFileSync('./.toolid', JSON.stringify(toolData, null, 2));
            console.log(chalk.green('[PROTECTION] Tool ID created successfully!'));
            console.log(chalk.cyan(`[PROTECTION] Tool ID: ${this.toolId.substring(0, 16)}...`));
            this.isValid = true;
        } catch (error) {
            console.log(chalk.red('[PROTECTION] Failed to create tool ID:', error.message));
        }
    }

    // Removed resetToolId method for security

    encryptData(data) {
        const algorithm = 'aes-256-cbc';
        const key = crypto.scryptSync(this.toolId, 'salt', 32);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return {
            iv: iv.toString('hex'),
            encrypted: encrypted
        };
    }

    decryptData(encryptedData) {
        try {
            const algorithm = 'aes-256-cbc';
            const key = crypto.scryptSync(this.toolId, 'salt', 32);
            const iv = Buffer.from(encryptedData.iv, 'hex');
            const decipher = crypto.createDecipheriv(algorithm, key, iv);
            let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return JSON.parse(decrypted);
        } catch (error) {
            console.log(chalk.red('[PROTECTION] Data corruption detected!'));
            return null;
        }
    }

    validateToken(token) {
        // Basic Discord token validation
        if (!token || token.length < 50) {
            return false;
        }
        
        // Check if token follows Discord format
        const tokenRegex = /^[A-Za-z\d]{23,28}\.[\w-]{6}\.[\w-]{27}$/;
        return tokenRegex.test(token);
    }

    sanitizeInput(input) {
        // Remove potentially dangerous characters
        return input.replace(/[<>\"'&]/g, '');
    }

    logEvent(event, details = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: event,
            toolId: this.toolId,
            details: details
        };

        const logFile = './tool.log';
        const encryptedLog = this.encryptData(logEntry);
        
        try {
            fs.appendFileSync(logFile, JSON.stringify(encryptedLog) + '\n');
        } catch (error) {
            // Silent fail for logging
        }
    }

    forceExit() {
        // Log the security violation
        this.logEvent('security_violation', {
            type: 'file_modification',
            timestamp: new Date().toISOString()
        });

        // Clear sensitive data from memory
        this.machineId = null;
        this.toolId = null;
        this.isValid = false;

        // Force exit after a short delay to show the message
        setTimeout(() => {
            console.log(chalk.red('[PROTECTION] Program terminated for security reasons.'));
            process.exit(1);
        }, 2000);
    }

    startContinuousMonitoring() {
        // Monitor files every 30 seconds
        setInterval(() => {
            if (!this.isValid) return;

            try {
                const criticalFiles = ['index.js', 'utils.js', 'protection.js', 'package.json'];
                
                // Check if files still exist
                for (const file of criticalFiles) {
                    if (!fs.existsSync(file)) {
                        console.log(chalk.red('[PROTECTION] Critical file missing during runtime!'));
                        this.forceExit();
                        return;
                    }
                }

                // Check file hashes
                if (fs.existsSync('./.filehashes')) {
                    const storedHashes = JSON.parse(fs.readFileSync('./.filehashes', 'utf8'));
                    
                    for (const [file, storedHash] of Object.entries(storedHashes)) {
                        if (fs.existsSync(file)) {
                            const content = fs.readFileSync(file, 'utf8');
                            const currentHash = crypto.createHash('sha256').update(content).digest('hex');
                            
                            if (currentHash !== storedHash) {
                                console.log(chalk.red('[PROTECTION] File modification detected during runtime!'));
                                console.log(chalk.red('[PROTECTION] Program terminated immediately.'));
                                this.forceExit();
                                return;
                            }
                        }
                    }
                }

            } catch (error) {
                console.log(chalk.red('[PROTECTION] Monitoring error:', error.message));
                this.forceExit();
            }
        }, 30000); // Check every 30 seconds

        console.log(chalk.green('[PROTECTION] Security monitoring active...'));
    }
}

module.exports = CopyProtection; 