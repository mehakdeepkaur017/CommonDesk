import { useQuery } from '@tanstack/react-query';
import { AuditService } from '../../services/audit.service';
import { useWorkspace } from './useWorkspace';

export const useAudit = (params: Record<string, any>) => {
  const { data: workspace } = useWorkspace();
  
  return useQuery({
    queryKey: ['audit-logs', workspace?.id, params],
    queryFn: () => AuditService.getLogs(params),
    enabled: !!workspace?.id,
    keepPreviousData: true,
  });
};
