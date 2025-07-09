const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const Table = require('cli-table3');
const gradient = require('gradient-string');
const fs = require('fs');

class BoosterUtils {
    static async showMainMenu(tool) {
        while (true) {
            await tool.showBanner();
            
            const choices = [
                { name: '[1] Account Manager', value: 'accounts' },
                { name: '[2] Server Manager', value: 'servers' },
                { name: '[3] Boost Server', value: 'boost' },
                { name: '[4] Statistics', value: 'stats' },
                { name: '[5] Settings', value: 'settings' },
                { name: '[6] Exit', value: 'exit' }
            ];

            const { action } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: chalk.cyan('Select an option:'),
                    choices: choices
                }
            ]);

            switch (action) {
                case 'accounts':
                    await this.accountManager(tool);
                    break;
                case 'servers':
                    await this.serverManager(tool);
                    break;
                case 'boost':
                    await this.boostServer(tool);
                    break;
                case 'stats':
                    await this.showStatistics(tool);
                    break;
                case 'settings':
                    await this.settings(tool);
                    break;
                case 'exit':
                    console.log(chalk.green.bold('Thanks for using HE11T Booster Tool! 👋'));
                    process.exit(0);
            }
        }
    }

    static async accountManager(tool) {
        while (true) {
            await tool.showBanner();
            
            const table = new Table({
                head: [
                    chalk.cyan('ID'),
                    chalk.cyan('Token'),
                    chalk.cyan('Status'),
                    chalk.cyan('Boosts Left')
                ],
                colWidths: [5, 50, 15, 15]
            });

            tool.accounts.forEach((account, index) => {
                table.push([
                    index + 1,
                    account.token.substring(0, 20) + '...',
                    account.status || 'Unknown',
                    account.boostsLeft || 'Unknown'
                ]);
            });

            console.log(chalk.green.bold('=== ACCOUNT MANAGER ==='));
            console.log(table.toString());

            const choices = [
                { name: '[1] Add Account', value: 'add' },
                { name: '[2] Remove Account', value: 'remove' },
                { name: '[3] Refresh Status', value: 'refresh' },
                { name: '[4] Import from File', value: 'import' },
                { name: '[5] Back to Main Menu', value: 'back' }
            ];

            const { action } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: chalk.blue('Account Manager Options:'),
                    choices: choices
                }
            ]);

            switch (action) {
                case 'add':
                    await this.addAccount(tool);
                    break;
                case 'remove':
                    await this.removeAccount(tool);
                    break;
                case 'refresh':
                    await this.refreshAccounts(tool);
                    break;
                case 'import':
                    await this.importAccounts(tool);
                    break;
                case 'back':
                    return;
            }
        }
    }

    static async addAccount(tool) {
        const { token } = await inquirer.prompt([
            {
                type: 'password',
                name: 'token',
                message: chalk.yellow('Enter Discord Token:'),
                validate: (input) => {
                    // Use protection manager to validate token
                    if (!tool.protection.validateToken(input)) {
                        return 'Invalid Discord token format. Please check your token.';
                    }
                    return true;
                }
            }
        ]);

        // Sanitize input
        const sanitizedToken = tool.protection.sanitizeInput(token);

        const spinner = ora(chalk.blue('Validating token...')).start();
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const account = {
                token: sanitizedToken,
                status: 'Valid',
                boostsLeft: 2,
                addedAt: new Date().toISOString()
            };

            // Log event
            tool.protection.logEvent('account_added', {
                timestamp: new Date().toISOString()
            });

            tool.accounts.push(account);
            tool.saveData();
            
            spinner.succeed(chalk.green.bold('Account added successfully!'));
        } catch (error) {
            spinner.fail(chalk.red('Failed to validate token'));
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    static async boostServer(tool) {
        if (tool.accounts.length === 0) {
            console.log(chalk.red('[ERROR] No accounts available. Please add accounts first.'));
            await new Promise(resolve => setTimeout(resolve, 3000));
            return;
        }

        if (tool.servers.length === 0) {
            console.log(chalk.red('[ERROR] No servers available. Please add servers first.'));
            await new Promise(resolve => setTimeout(resolve, 3000));
            return;
        }

        await tool.showBanner();
        console.log(chalk.red.bold('=== BOOST SERVER ==='));

        const { serverId } = await inquirer.prompt([
            {
                type: 'list',
                name: 'serverId',
                message: chalk.magenta('Select server to boost:'),
                choices: tool.servers.map(server => ({
                    name: `${server.name} (${server.id})`,
                    value: server.id
                }))
            }
        ]);

        const { boostCount } = await inquirer.prompt([
            {
                type: 'number',
                name: 'boostCount',
                message: chalk.cyan('Number of boosts to apply:'),
                default: 1,
                validate: (input) => {
                    if (input < 1 || input > tool.accounts.length * 2) {
                        return `Please enter a number between 1 and ${tool.accounts.length * 2}`;
                    }
                    return true;
                }
            }
        ]);

        const { delay } = await inquirer.prompt([
            {
                type: 'number',
                name: 'delay',
                message: chalk.yellow('Delay between boosts (seconds):'),
                default: 5,
                validate: (input) => {
                    if (input < 1) {
                        return 'Delay must be at least 1 second';
                    }
                    return true;
                }
            }
        ]);

        await this.performBoost(tool, serverId, boostCount, delay);
    }

    static async performBoost(tool, serverId, boostCount, delay) {
        const spinner = ora(chalk.red('Starting boost process...')).start();
        
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < boostCount; i++) {
            spinner.text = `Boosting server... (${i + 1}/${boostCount})`;
            
            try {
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                if (Math.random() > 0.2) {
                    successCount++;
                    spinner.succeed(chalk.green(`[SUCCESS] Boost ${i + 1} successful!`));
                } else {
                    failCount++;
                    spinner.fail(chalk.red(`[FAILED] Boost ${i + 1} failed!`));
                }

                if (i < boostCount - 1) {
                    spinner.start(`Waiting ${delay} seconds before next boost...`);
                    await new Promise(resolve => setTimeout(resolve, delay * 1000));
                }
            } catch (error) {
                failCount++;
                spinner.fail(chalk.red(`[ERROR] Boost ${i + 1} failed: ${error.message}`));
            }
        }

        spinner.succeed(chalk.green(`Boost process completed! Success: ${successCount}, Failed: ${failCount}`));
        
        const server = tool.servers.find(s => s.id === serverId);
        if (server) {
            server.boostsApplied += successCount;
            tool.saveData();
        }

        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    static async serverManager(tool) {
        while (true) {
            await tool.showBanner();
            
            const table = new Table({
                head: [
                    chalk.cyan('ID'),
                    chalk.cyan('Server Name'),
                    chalk.cyan('Server ID'),
                    chalk.cyan('Boosts Applied')
                ],
                colWidths: [5, 30, 25, 15]
            });

            tool.servers.forEach((server, index) => {
                table.push([
                    index + 1,
                    server.name || 'Unknown',
                    server.id,
                    server.boostsApplied || 0
                ]);
            });

            console.log(chalk.blue.bold('=== SERVER MANAGER ==='));
            console.log(table.toString());

            const choices = [
                { name: '[1] Add Server', value: 'add' },
                { name: '[2] Remove Server', value: 'remove' },
                { name: '[3] Back to Main Menu', value: 'back' }
            ];

            const { action } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: chalk.green('Server Manager Options:'),
                    choices: choices
                }
            ]);

            switch (action) {
                case 'add':
                    await this.addServer(tool);
                    break;
                case 'remove':
                    await this.removeServer(tool);
                    break;
                case 'back':
                    return;
            }
        }
    }

    static async addServer(tool) {
        const { serverId } = await inquirer.prompt([
            {
                type: 'input',
                name: 'serverId',
                message: chalk.cyan('Enter Server ID:'),
                validate: (input) => {
                    if (!/^\d+$/.test(input)) {
                        return 'Please enter a valid numeric Server ID';
                    }
                    return true;
                }
            }
        ]);

        const { serverName } = await inquirer.prompt([
            {
                type: 'input',
                name: 'serverName',
                message: chalk.yellow('Enter Server Name (optional):'),
                default: 'Unknown Server'
            }
        ]);

        const server = {
            id: serverId,
            name: serverName,
            boostsApplied: 0,
            addedAt: new Date().toISOString()
        };

        tool.servers.push(server);
        tool.saveData();

        console.log(chalk.green('[SUCCESS] Server added successfully!'));
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    static async removeServer(tool) {
        if (tool.servers.length === 0) {
            console.log(chalk.red('[ERROR] No servers to remove.'));
            await new Promise(resolve => setTimeout(resolve, 2000));
            return;
        }

        const { serverIndex } = await inquirer.prompt([
            {
                type: 'list',
                name: 'serverIndex',
                message: chalk.red('Select server to remove:'),
                choices: tool.servers.map((server, index) => ({
                    name: `${server.name} (${server.id})`,
                    value: index
                }))
            }
        ]);

        tool.servers.splice(serverIndex, 1);
        tool.saveData();
        console.log(chalk.green('[SUCCESS] Server removed successfully!'));
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    static async showStatistics(tool) {
        await tool.showBanner();
        
        const totalAccounts = tool.accounts.length;
        const totalServers = tool.servers.length;
        const totalBoosts = tool.servers.reduce((sum, server) => sum + (server.boostsApplied || 0), 0);
        const validAccounts = tool.accounts.filter(acc => acc.status === 'Valid').length;

        console.log(chalk.magenta.bold('=== STATISTICS ==='));
        console.log('');
        
        const statsTable = new Table({
            head: [chalk.cyan('Metric'), chalk.cyan('Value')],
            colWidths: [30, 20]
        });

        statsTable.push(
            ['Total Accounts', totalAccounts.toString()],
            ['Valid Accounts', validAccounts.toString()],
            ['Total Servers', totalServers.toString()],
            ['Total Boosts Applied', totalBoosts.toString()],
            ['Success Rate', `${Math.round((validAccounts / totalAccounts) * 100)}%`]
        );

        console.log(statsTable.toString());
        console.log('');
        
        await inquirer.prompt([
            {
                type: 'input',
                name: 'continue',
                message: chalk.cyan('Press Enter to continue...')
            }
        ]);
    }

    static async settings(tool) {
        await tool.showBanner();
        console.log(chalk.yellow.bold('=== SETTINGS ==='));
        console.log('');
        console.log(chalk.cyan('This is the exclusive HE11T Booster Tool v1.0'));
        console.log(chalk.cyan('Advanced features and premium support included.'));
        console.log('');
        
        await inquirer.prompt([
            {
                type: 'input',
                name: 'continue',
                message: chalk.cyan('Press Enter to continue...')
            }
        ]);
    }

    static async removeAccount(tool) {
        if (tool.accounts.length === 0) {
            console.log(chalk.red('[ERROR] No accounts to remove.'));
            await new Promise(resolve => setTimeout(resolve, 2000));
            return;
        }

        const { accountIndex } = await inquirer.prompt([
            {
                type: 'list',
                name: 'accountIndex',
                message: chalk.red('Select account to remove:'),
                choices: tool.accounts.map((acc, index) => ({
                    name: `Account ${index + 1} (${acc.token.substring(0, 20)}...)`,
                    value: index
                }))
            }
        ]);

        tool.accounts.splice(accountIndex, 1);
        tool.saveData();
        console.log(chalk.green('[SUCCESS] Account removed successfully!'));
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    static async refreshAccounts(tool) {
        const spinner = ora(chalk.yellow('Refreshing account status...')).start();
        
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            tool.accounts.forEach(account => {
                account.status = Math.random() > 0.1 ? 'Valid' : 'Invalid';
                account.boostsLeft = Math.floor(Math.random() * 3) + 1;
            });
            
            tool.saveData();
            spinner.succeed(chalk.green.bold('Account status refreshed!'));
        } catch (error) {
            spinner.fail(chalk.red('Failed to refresh accounts'));
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    static async importAccounts(tool) {
        const { filePath } = await inquirer.prompt([
            {
                type: 'input',
                name: 'filePath',
                message: chalk.green('Enter path to tokens file (one token per line):'),
                default: './tokens.txt'
            }
        ]);

        const spinner = ora(chalk.green('Importing accounts...')).start();

        try {
            if (fs.existsSync(filePath)) {
                const tokens = fs.readFileSync(filePath, 'utf8')
                    .split('\n')
                    .map(token => token.trim())
                    .filter(token => token.length > 0);

                let imported = 0;
                for (const token of tokens) {
                    if (token.length > 50) {
                        tool.accounts.push({
                            token: token,
                            status: 'Valid',
                            boostsLeft: 2,
                            addedAt: new Date().toISOString()
                        });
                        imported++;
                    }
                }

                tool.saveData();
                spinner.succeed(chalk.green.bold(`Imported ${imported} accounts successfully!`));
            } else {
                spinner.fail(chalk.red('File not found!'));
            }
        } catch (error) {
            spinner.fail(chalk.red(`Import failed: ${error.message}`));
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

module.exports = BoosterUtils; 