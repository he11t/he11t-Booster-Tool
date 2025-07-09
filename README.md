# HE11T Booster Tool - Advanced Discord Server Booster

[🇸🇦 العربية](README_AR.md) | [🇺🇸 English](README.md)

An exclusive and advanced Discord server booster tool with a beautiful command-line interface.

## 🚀 Features

- **Advanced Account Management**: Add, remove, and manage Discord accounts
- **Server Management**: Add and manage target servers
- **Bulk Boosting**: Apply multiple boosts with configurable delays
- **Statistics Tracking**: Monitor boost success rates and account status
- **Beautiful UI**: Exclusive gradient interface with animations
- **Data Persistence**: Automatically saves accounts and servers
- **Token Import**: Import tokens from text files
- **Account Validation**: Validate account tokens and status

## 📋 Requirements

- Node.js (v14 or higher)
- npm or yarn
- Discord accounts with Nitro (for boosting)

## 🛠️ Installation

1. **Clone or download the project**
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the tool**:
   ```bash
   npm start
   ```



## 📖 Usage

### Getting Started

1. **Launch the tool**:
   ```bash
   node index.js
   ```

2. **Add Discord Accounts**:
   - Go to "Account Manager"
   - Select "Add Account"
   - Enter your Discord token
   - The tool will validate the token

3. **Add Target Servers**:
   - Go to "Server Manager"
   - Select "Add Server"
   - Enter the server ID and name

4. **Boost Servers**:
   - Go to "Boost Server"
   - Select target server
   - Choose number of boosts
   - Set delay between boosts
   - Start the boost process

### Account Tokens

To get your Discord token:
1. Open Discord in your browser
2. Press F12 to open Developer Tools
3. Go to Network tab
4. Send a message in any channel
5. Look for the request and find the "authorization" header
6. Copy the token value

### Importing Tokens

Create a `tokens.txt` file with one token per line:
```
token1_here
token2_here
token3_here
```

Then use the "Import from File" option in Account Manager.

## 🎨 Features

### Main Menu
- [1] **Account Manager**: Manage Discord accounts
- [2] **Server Manager**: Manage target servers
- [3] **Boost Server**: Apply boosts to servers
- [4] **Statistics**: View boost statistics
- [5] **Settings**: Tool information
- [6] **Exit**: Close the tool

### Account Manager
- [1] **Add Account**: Add new Discord account
- [2] **Remove Account**: Remove existing account
- [3] **Refresh Status**: Update account status
- [4] **Import from File**: Import tokens from file

### Server Manager
- [1] **Add Server**: Add target server
- [2] **Remove Server**: Remove server from list

## 📊 Statistics

The tool tracks:
- Total accounts
- Valid accounts
- Total servers
- Total boosts applied
- Success rate

## ⚠️ Important Notes

- **Legal Compliance**: Ensure you comply with Discord's Terms of Service
- **Account Safety**: Use accounts responsibly
- **Rate Limiting**: The tool includes delays to avoid rate limits
- **Token Security**: Keep your tokens secure and private

## 🔧 Configuration

The tool automatically creates:
- `accounts.json`: Stores account data
- `servers.json`: Stores server data

## 🎯 Advanced Features

- **Smart Delays**: Configurable delays between boosts
- **Status Tracking**: Real-time account status monitoring
- **Error Handling**: Robust error handling and recovery
- **Data Validation**: Input validation for all fields

## 🚨 Disclaimer

This tool is for educational purposes. Users are responsible for complying with Discord's Terms of Service and applicable laws. The developers are not responsible for any misuse of this tool.

## 📞 Support

For support and updates, contact the development team.

---

**HE11T Booster Tool v1.0 - Exclusive Edition** 