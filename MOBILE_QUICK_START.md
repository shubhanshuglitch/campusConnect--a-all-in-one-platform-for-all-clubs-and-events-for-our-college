# 📱 Quick Mobile Testing Guide

## How to Test on Your Phone

### Step 1: Start Your Server
```powershell
# Make sure your server is running
node server.js
```

### Step 2: Find Your Computer's IP
```powershell
ipconfig
```
Look for **IPv4 Address** (e.g., `192.168.1.100`)

### Step 3: Connect from Phone
1. Make sure phone and computer are on **same WiFi**
2. Open browser on your phone
3. Go to: `http://YOUR_IP:3000`
   - Example: `http://192.168.1.100:3000`

---

## Quick Feature Checklist

### ✅ Must Test
- [ ] Hamburger menu opens/closes
- [ ] Swipe gestures work (swipe from left edge)
- [ ] Buttons are easy to tap
- [ ] Forms don't zoom on input focus
- [ ] All pages display correctly
- [ ] Images load properly
- [ ] No horizontal scroll
- [ ] Login/signup works

### 📱 Screen Sizes
- Portrait mode (vertical)
- Landscape mode (horizontal)

### 🌐 Recommended Browsers
- Chrome (best)
- Safari
- Firefox

---

## Common Fixes

**Can't connect?**
- Check WiFi connection
- Verify IP address
- Check firewall settings
- Try another browser

**Menu not working?**
- Refresh the page
- Clear browser cache
- Check JavaScript console

**Page looks weird?**
- Force refresh (Ctrl+Shift+R)
- Clear cache
- Try incognito mode

---

## Add to Home Screen

### iOS
1. Tap share icon
2. "Add to Home Screen"
3. Enjoy fullscreen app!

### Android
1. Menu (3 dots)
2. "Add to Home Screen"
3. Done!

---

**Happy Testing! 🎉**
