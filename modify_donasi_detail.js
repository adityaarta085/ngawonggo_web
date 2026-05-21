const fs = require('fs');

let content = fs.readFileSync('src/views/DonasiPage/DonasiDetail.js', 'utf8');

// 1. Update useParams to include trx_id
content = content.replace('const { id } = useParams();', 'const { id, trx_id } = useParams();');

// 2. Add state for timeLeft
content = content.replace("const [paymentStatus, setPaymentStatus] = useState('pending');", "const [paymentStatus, setPaymentStatus] = useState('pending');\n  const [timeLeft, setTimeLeft] = useState(15 * 60);");

// 3. Update useEffect for fetching to include transaction
const fetchUseEffectTarget = `  useEffect(() => {
    const fetchCampaign = async () => {
      const { data, error } = await supabase
        .from('donation_campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        toast({ title: 'Campaign tidak ditemukan', status: 'error' });
        navigate('/donasi');
        return;
      }
      setCampaign(data);

      const { data: donatorsData } = await supabase
        .from('donations')
        .select('*')
        .eq('campaign_id', id)
        .eq('status', 'success')
        .order('created_at', { ascending: false });

      if (donatorsData) setDonators(donatorsData);
      setLoading(false);
    };

    fetchCampaign();
  }, [id, navigate, toast]);`;

const fetchUseEffectReplacement = `  useEffect(() => {
    const fetchCampaignAndTransaction = async () => {
      const { data, error } = await supabase
        .from('donation_campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        toast({ title: 'Campaign tidak ditemukan', status: 'error' });
        navigate('/donasi');
        return;
      }
      setCampaign(data);

      const { data: donatorsData } = await supabase
        .from('donations')
        .select('*')
        .eq('campaign_id', id)
        .eq('status', 'success')
        .order('created_at', { ascending: false });

      if (donatorsData) setDonators(donatorsData);

      if (trx_id) {
        const { data: trxData, error: trxError } = await supabase
          .from('donations')
          .select('*')
          .eq('trx_id', trx_id)
          .single();

        if (!trxError && trxData) {
          setPaymentData({
            trx_id: trxData.trx_id,
            payment_url: trxData.payment_url,
            qr_image: trxData.qr_image,
            amount: trxData.amount,
            created_at: trxData.created_at
          });
          setPaymentStatus(trxData.status);

          if (trxData.status === 'pending') {
            const createdAt = new Date(trxData.created_at).getTime();
            const now = new Date().getTime();
            const diffSeconds = Math.floor((createdAt + 15 * 60 * 1000 - now) / 1000);

            if (diffSeconds > 0) {
              setTimeLeft(diffSeconds);
            } else {
              setPaymentStatus('expired');
            }
          }
        }
      }

      setLoading(false);
    };

    fetchCampaignAndTransaction();
  }, [id, trx_id, navigate, toast]);`;

content = content.replace(fetchUseEffectTarget, fetchUseEffectReplacement);

fs.writeFileSync('src/views/DonasiPage/DonasiDetail.js', content, 'utf8');
