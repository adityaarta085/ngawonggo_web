sed -i '/const purchaseVipDirect/i \
  const giftVipCard = async (receiverEmail) => {\
      if (!user || gachaStats.vip_cards < 1) return false;\
      const { data } = await supabase.rpc("gift_vip_card", { p_sender_id: user.id, p_receiver_email: receiverEmail });\
      if (data) {\
          setGachaStats(prev => ({ ...prev, vip_cards: prev.vip_cards - 1 }));\
          toast({ title: "Berhasil!", description: "VIP Card berhasil dikirim ke " + receiverEmail, status: "success" });\
          return true;\
      }\
      toast({ title: "Gagal", description: "Email tidak ditemukan atau error.", status: "error" });\
      return false;\
  };\
' src/contexts/MonetizationContext.js
