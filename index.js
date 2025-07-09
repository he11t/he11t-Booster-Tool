const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const figlet = require('figlet');
const gradient = require('gradient-string');
const Table = require('cli-table3');
const fs = require('fs');
const path = require('path');
const BoosterUtils = require('./utils');
const CopyProtection = require('./protection');

class DiscordBoosterTool {
    constructor() {
        this.protection = new CopyProtection();
        this.accounts = [];
        this.servers = [];
        this.isInitialized = false;
    }

    async initialize() {
        console.log(chalk.cyan('[SYSTEM] Initializing HE11T Booster Tool...'));
        
        // Check tool integrity and copy protection
        const isIntegrityValid = await this.protection.checkToolIntegrity();
        if (!isIntegrityValid) {
            console.log(chalk.red('[PROTECTION] Tool integrity check failed! Exiting...'));
            process.exit(1);
        }

        // Load encrypted data
        this.loadData();
        this.isInitialized = true;
        
        // Start continuous file monitoring
        this.protection.startContinuousMonitoring();
        
        // Log successful initialization
        this.protection.logEvent('tool_initialized', {
            timestamp: new Date().toISOString()
        });
    }

    async showBanner() {
        console.clear();
        const banner = figlet.textSync('he11t Booster Tool', {
            font: 'Standard',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        });
        
        console.log(chalk.cyan(banner));
        console.log(chalk.magenta('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.magenta('║                    ADVANCED DISCORD BOOSTER TOOL            ║'));
        console.log(chalk.magenta('║                        EXCLUSIVE EDITION                    ║'));
        console.log(chalk.magenta('╚══════════════════════════════════════════════════════════════╝'));
        console.log('');
    }

    loadData() {
        try {
            if (fs.existsSync('./accounts.enc')) {
                const encryptedAccounts = JSON.parse(fs.readFileSync('./accounts.enc', 'utf8'));
                this.accounts = this.protection.decryptData(encryptedAccounts);
            }
            if (fs.existsSync('./servers.enc')) {
                const encryptedServers = JSON.parse(fs.readFileSync('./servers.enc', 'utf8'));
                this.servers = this.protection.decryptData(encryptedServers);
            }
        } catch (error) {
            console.log(chalk.red('[ERROR] Error loading encrypted data:', error.message));
            this.protection.logEvent('data_load_error', { error: error.message });
        }
    }

    saveData() {
        try {
            // Encrypt and save accounts
            const encryptedAccounts = this.protection.encryptData(this.accounts);
            fs.writeFileSync('./accounts.enc', JSON.stringify(encryptedAccounts, null, 2));
            
            // Encrypt and save servers
            const encryptedServers = this.protection.encryptData(this.servers);
            fs.writeFileSync('./servers.enc', JSON.stringify(encryptedServers, null, 2));
            
            // Log event
            this.protection.logEvent('data_saved', {
                accountsCount: this.accounts.length,
                serversCount: this.servers.length
            });
        } catch (error) {
            console.log(chalk.red('[ERROR] Error saving encrypted data:', error.message));
            this.protection.logEvent('data_save_error', { error: error.message });
        }
    }

    async start() {
        if (!this.isInitialized) {
            await this.initialize();
        }
        await BoosterUtils.showMainMenu(this);
    }
}

// Start the application
async function main() {
    try {
        const tool = new DiscordBoosterTool();
        await tool.start();
    } catch (error) {
        console.error(chalk.red('An error occurred:', error.message));
        process.exit(1);
    }
}

main(); 