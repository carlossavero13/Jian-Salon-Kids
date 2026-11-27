// Set only the official profile URLs supplied by the salon.
export const socialProfiles = { facebook: 'https://www.facebook.com/JianSalon', tiktok: 'https://www.tiktok.com/@jian.salon.kids.p' };

export function initSocialLinks() {
  const group = document.querySelector('.header-socials');
  if (!group) return;
  let count = 0;
  group.querySelectorAll('[data-social]').forEach((link) => {
    const url = socialProfiles[link.dataset.social];
    if (!url) return;
    link.href = url;
    link.hidden = false;
    count += 1;
  });
  group.hidden = count === 0;
}
