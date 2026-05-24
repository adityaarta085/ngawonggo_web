with open('src/components/CustomAds.js', 'r') as f:
    content = f.read()

# Fix unused import
content = content.replace("  IconButton,\n", "")

# Fix useEffect cleanup
old_use_effect = """  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = entry.target;
          if (entry.isIntersecting) {
            videoElement.play().catch(e => console.log('Autoplay prevented:', e));
          } else {
            videoElement.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    Object.values(videoRefs.current).forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      Object.values(videoRefs.current).forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [ads]);"""

new_use_effect = """  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = entry.target;
          if (entry.isIntersecting) {
            videoElement.play().catch(e => console.log('Autoplay prevented:', e));
          } else {
            videoElement.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    const currentRefs = videoRefs.current;
    Object.values(currentRefs).forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      Object.values(currentRefs).forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [ads]);"""

content = content.replace(old_use_effect, new_use_effect)

with open('src/components/CustomAds.js', 'w') as f:
    f.write(content)
