## 🔹 process.on('unhandledRejection', handler)

📌 কী হয় এতে?
যখন কোনো Promise রিজেক্ট হয় কিন্তু .catch() দেওয়া হয় না, তখন এই ইভেন্টটি ট্রিগার হয়।

✅ উপকারিতা:

- অ্যাপ হঠাৎ crash না করে, graceful shutdown করতে পারে।

- লগে error stack print করা যায়।

- সার্ভার/ডেটাবেজ কানেকশন ক্লোজ করে clean ভাবে exit করা যায়।

উদাহরণ:

```bash
Promise.reject(new Error("I forgot to catch this promise"))
```

## 🔹 process.on('uncaughtException', handler)

📌 কী হয় এতে?
যখন কোনো synchronous code-এ exception হয় এবং সেটি try-catch ব্লকে না ধরা হয়।

✅ উপকারিতা:

- throw new Error() বা ভুল ভ্যারিয়েবল (console.log(a)) থেকে অ্যাপ crash হওয়া রোধ করা যায়।
- ব্যবহারকারীকে internal error মেসেজ দিয়ে সার্ভার রিস্টার্টের সময় প্রস্তুতি নেওয়া যায়।

## 🔹 process.on('SIGINT', handler)

📌 কী হয় এতে?
যখন ইউজার Ctrl+C চাপ দেয় CLI-তে (interrupt signal), তখন এই ইভেন্ট চলে।

✅ উপকারিতা:

- সার্ভার বন্ধ করার আগে সকল pending কাজ (ডেটা সেভ, কানেকশন ক্লোজ) শেষ করতে পারে।
- sudden shutdown এ ডেটা loss/করাপশন রোধ করা যায়।

## 🔹 process.on('SIGTERM', handler)

📌 কী হয় এতে?
যখন প্রোডাকশন সার্ভারে (যেমন Docker, PM2) থেকে kill signal পাঠানো হয় তখন এই ইভেন্ট চলে।

✅ উপকারিতা:

- Docker container বা cloud (Heroku, Vercel) environment-এ auto-restart বা kill-signal properly handle করা যায়।
- সার্ভার shutdown হলে ডেটা বা কানেকশন লস না হয়।
