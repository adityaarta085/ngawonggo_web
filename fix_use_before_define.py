with open('src/views/AdminPage/components/IklanManager.js', 'r') as f:
    content = f.read()

# Extract useEffect and fetchAds
use_effect_pattern = """  useEffect(() => {
    fetchAds();
  }, [fetchAds]);"""

fetch_ads_pattern = """  const fetchAds = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('custom_ads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Gagal mengambil data', status: 'error' });
    } else {
      setAds(data || []);
    }
    setIsLoading(false);
  }, [toast]);"""

# Remove them from their current positions
content = content.replace(use_effect_pattern, "")
content = content.replace(fetch_ads_pattern, "")

# Find the insertion point (after placements array definition)
insertion_point = """  const placements = [
    { value: 'inline', label: 'Inline (Dalam Konten)' },
    { value: 'popup_bottom', label: 'Popup Kanan Bawah' },
    { value: 'popup_top', label: 'Popup Kanan Atas' },
    { value: 'popup_center', label: 'Popup Tengah' },
  ];"""

new_insertion = insertion_point + "\n\n" + fetch_ads_pattern + "\n\n" + use_effect_pattern

content = content.replace(insertion_point, new_insertion)

with open('src/views/AdminPage/components/IklanManager.js', 'w') as f:
    f.write(content)
