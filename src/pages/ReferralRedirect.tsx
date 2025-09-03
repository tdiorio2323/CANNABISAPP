import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function ReferralRedirect() {
  const { code = '' } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    const target = `/vip?r=${encodeURIComponent(code)}`;
    document.cookie = `ref_code=${encodeURIComponent(code)};path=/;max-age=${60*60*24*30}`;
    nav(target, { replace: true });
  }, [code, nav]);

  return null;
}
