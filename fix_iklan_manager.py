import re

with open('src/views/AdminPage/components/IklanManager.js', 'r') as f:
    content = f.read()

# Make fetchAds useCallback
if "import React, { useState, useEffect, useCallback }" not in content:
    content = content.replace("import React, { useState, useEffect }", "import React, { useState, useEffect, useCallback }")

old_fetch_ads = """  const fetchAds = async () => {
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
  };"""

new_fetch_ads = """  const fetchAds = useCallback(async () => {
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

content = content.replace(old_fetch_ads, new_fetch_ads)

old_use_effect = """  useEffect(() => {
    fetchAds();
  }, []);"""

new_use_effect = """  useEffect(() => {
    fetchAds();
  }, [fetchAds]);"""

content = content.replace(old_use_effect, new_use_effect)

with open('src/views/AdminPage/components/IklanManager.js', 'w') as f:
    f.write(content)
