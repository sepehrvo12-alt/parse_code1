import Parser from './parser.js';

const parser = new Parser();
const outputDiv = document.getElementById('output');
const inputField = document.getElementById('command-input');

function printToTerminal(text, isError = false) {
  const line = document.createElement('div');
  line.style.color = isError ? '#ff5555' : '#00ff00';
  line.textContent = text;
  outputDiv.appendChild(line);
  outputDiv.scrollTop = outputDiv.scrollHeight;
}

function executeCommand(command) {
  // نمایش دستور کاربر
  printToTerminal(`$ ${command}`);

  // مرحله ۱: تبدیل فارسی به کد
  const parsed = parser.parse(command);
  if (parsed.error) {
    printToTerminal(`Error ${parsed.error.type}: ${parsed.error.message}`, true);
    return;
  }

  const code = parsed.code;
  printToTerminal(`> ${code}`); // نمایش کد تولید شده (اختیاری)

  // مرحله ۲: بررسی وجود API (خطای 400)
  if (code.includes('fetch(') || code.includes('XMLHttpRequest') || code.includes('axios') || code.includes('http')) {
    printToTerminal('Error 400: این کد به اینترنت نیاز دارد و در ترمینال آفلاین قابل اجرا نیست.', true);
    return;
  }

  // مرحله ۳: اجرای کد (بدون محدودیت)
  try {
    // استفاده از تابع new Function برای ایزوله کردن نسبی (هنوز هم خطرناک است، اما کاربر خواسته)
    const func = new Function(code);
    const result = func(); // اگر کد مقدار برگرداند، در result ذخیره می‌شود
    if (result !== undefined) {
      printToTerminal(String(result));
    }
  } catch (e) {
    printToTerminal(`Error 500: ${e.message}`, true);
  }
}

inputField.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const command = inputField.value;
    if (command) {
      executeCommand(command);
      inputField.value = '';
    }
  }
});

// پیام خوش‌آمدگویی
printToTerminal('پارس کده - ترمینال فارسی به جاوااسکریپت (نسخه نهایی)');
printToTerminal('نوع کمک برای دیدن دستورات موجود.');
