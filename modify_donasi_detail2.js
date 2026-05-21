const fs = require('fs');
let content = fs.readFileSync('src/views/DonasiPage/DonasiDetail.js', 'utf8');

// 4. Update countdown timer effect
const countdownTarget = `  useEffect(() => {
      let interval;
      const checkStatus = async () => {`;

const countdownReplacement = `  // Countdown Timer
  useEffect(() => {
    let timer;
    if (paymentData && paymentStatus === 'pending') {
      timer = setInterval(() => {
        const createdAt = new Date(paymentData.created_at || Date.now()).getTime();
        const now = new Date().getTime();
        const diffSeconds = Math.floor((createdAt + 15 * 60 * 1000 - now) / 1000);

        if (diffSeconds > 0) {
          setTimeLeft(diffSeconds);
        } else {
          setTimeLeft(0);
          setPaymentStatus('expired');
          clearInterval(timer);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [paymentData, paymentStatus]);

  // Polling Status
  useEffect(() => {
      let interval;
      const checkStatus = async () => {`;

content = content.replace(countdownTarget, countdownReplacement);

fs.writeFileSync('src/views/DonasiPage/DonasiDetail.js', content, 'utf8');
