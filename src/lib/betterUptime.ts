export interface MonitorAttributes {
  url: string;
  pronounceable_name: string;
  monitor_type: string;
  monitor_group_id: string;
  last_checked_at: string;
  status: 'paused' | 'pending' | 'maintenance' | 'up' | 'validating' | 'down';
  policy_id: string | null;
  expiration_policy_id: string | null;
  team_name: string;
  required_keyword: string;
  verify_ssl: boolean;
  check_frequency: number;
  call: boolean;
  sms: boolean;
  email: boolean;
  push: boolean;
  team_wait: number | null;
  http_method: string;
  request_timeout: number;
  recovery_period: number;
  request_headers: Array<{ id: string; name: string; value: string }>;
  request_body: string;
  paused_at: string | null;
  created_at: string;
  updated_at: string;
  ssl_expiration: number;
  domain_expiration: number;
  regions: string[];
  maintenance_from: string;
  maintenance_to: string;
  maintenance_timezone: string;
  maintenance_days: string[];
  port: number | null;
  confirmation_period: number;
  expected_status_codes: number[];
  environment_variables: Record<string, string>;
}

export interface MonitorResponse {
  data: {
    id: string;
    type: 'monitor';
    attributes: MonitorAttributes;
  };
}

export async function fetchMonitor(): Promise<MonitorResponse> {
  const token = process.env.UPTIME_API_TOKEN;
  const monitorId = process.env.UPTIME_MONITOR_ID;

  if (!token || !monitorId) {
    throw new Error(
      'Missing required environment variables: UPTIME_API_TOKEN or UPTIME_MONITOR_ID',
    );
  }

  const response = await fetch(`https://uptime.betterstack.com/api/v2/monitors/${monitorId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`BetterUptime API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<MonitorResponse>;
}
