'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Database,
  Table,
  Eye,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';

interface TestResult {
  success: boolean;
  action?: string;
  table?: string;
  data?: any;
  error?: string;
  timestamp: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  action: string;
  success: boolean;
  error?: string;
  duration?: number;
}

export default function DatabaseTestPage() {
  const [selectedTable, setSelectedTable] = useState('');
  const [tables, setTables] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableSchema, setTableSchema] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [customQuery, setCustomQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    'unknown' | 'connected' | 'error'
  >('unknown');

  // 로그 추가 함수
  const addLog = (
    action: string,
    success: boolean,
    error?: string,
    duration?: number
  ) => {
    const log: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString('ko-KR'),
      action,
      success,
      error,
      duration,
    };
    setLogs((prev) => [log, ...prev.slice(0, 49)]); // 최대 50개 로그 유지
  };

  // API 호출 함수
  const callAPI = async (action: string, table?: string, limit?: number) => {
    const startTime = Date.now();
    setLoading(true);

    try {
      const params = new URLSearchParams({ action });
      if (table) params.append('table', table);
      if (limit) params.append('limit', limit.toString());

      const response = await fetch(`/api/db-test?${params}`);
      const result: TestResult = await response.json();

      const duration = Date.now() - startTime;
      addLog(action, result.success, result.error, duration);

      return result;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      addLog(action, false, error.message, duration);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 연결 테스트
  const testConnection = async () => {
    try {
      const result = await callAPI('test_connection');
      setConnectionStatus(result.success ? 'connected' : 'error');
    } catch (error) {
      setConnectionStatus('error');
    }
  };

  // 테이블 목록 조회
  const loadTables = async () => {
    try {
      const result = await callAPI('tables');
      if (result.success) {
        setTables(result.data || []);
      }
    } catch (error) {
      console.error('Failed to load tables:', error);
    }
  };

  // 테이블 데이터 조회
  const loadTableData = async (tableName: string) => {
    try {
      const result = await callAPI('table_data', tableName, 10);
      if (result.success) {
        setTableData(result.data || []);
      }
    } catch (error) {
      console.error('Failed to load table data:', error);
    }
  };

  // 테이블 스키마 조회
  const loadTableSchema = async (tableName: string) => {
    try {
      const result = await callAPI('table_schema', tableName);
      if (result.success) {
        setTableSchema(result.data || []);
      }
    } catch (error) {
      console.error('Failed to load table schema:', error);
    }
  };

  // 커스텀 쿼리 실행
  const executeCustomQuery = async () => {
    if (!customQuery.trim()) return;

    try {
      const response = await fetch('/api/db-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: customQuery }),
      });

      const result = await response.json();
      setQueryResult(result);
      addLog('custom_query', result.success, result.error);
    } catch (error: any) {
      addLog('custom_query', false, error.message);
    }
  };

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    testConnection();
    loadTables();
  }, []);

  // 테이블 선택 시 데이터 로드
  useEffect(() => {
    if (selectedTable) {
      loadTableData(selectedTable);
      loadTableSchema(selectedTable);
    }
  }, [selectedTable]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">데이터베이스 테스트</h1>
          <p className="text-muted-foreground">
            Supabase 데이터베이스 연결 및 테이블 조회 테스트
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={
              connectionStatus === 'connected'
                ? 'default'
                : connectionStatus === 'error'
                ? 'destructive'
                : 'secondary'
            }
            className="flex items-center gap-1"
          >
            {connectionStatus === 'connected' ? (
              <CheckCircle className="w-3 h-3" />
            ) : connectionStatus === 'error' ? (
              <AlertCircle className="w-3 h-3" />
            ) : (
              <Clock className="w-3 h-3" />
            )}
            {connectionStatus === 'connected'
              ? '연결됨'
              : connectionStatus === 'error'
              ? '연결 실패'
              : '알 수 없음'}
          </Badge>
          <Button onClick={testConnection} variant="outline" size="sm">
            <Database className="w-4 h-4 mr-2" />
            연결 테스트
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tables" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tables">테이블 조회</TabsTrigger>
          <TabsTrigger value="query">커스텀 쿼리</TabsTrigger>
          <TabsTrigger value="logs">실행 로그</TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 테이블 목록 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Table className="w-5 h-5" />
                  테이블 목록
                </CardTitle>
                <CardDescription>
                  데이터베이스의 모든 테이블 목록입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {tables.map((table, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedTable === table.table_name
                          ? 'bg-primary/10 border-primary'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setSelectedTable(table.table_name)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{table.table_name}</span>
                        <Badge variant="outline">{table.table_type}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 테이블 스키마 */}
            <Card>
              <CardHeader>
                <CardTitle>테이블 스키마</CardTitle>
                <CardDescription>
                  {selectedTable
                    ? `${selectedTable} 테이블의 구조`
                    : '테이블을 선택하세요'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedTable ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {tableSchema.map((column, index) => (
                      <div key={index} className="p-2 rounded border">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {column.column_name}
                          </span>
                          <Badge variant="secondary">{column.data_type}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {column.is_nullable === 'YES'
                            ? 'NULL 허용'
                            : 'NOT NULL'}
                          {column.column_default &&
                            ` • 기본값: ${column.column_default}`}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    테이블을 선택하면 스키마가 표시됩니다.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 테이블 데이터 */}
          {selectedTable && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  테이블 데이터: {selectedTable}
                </CardTitle>
                <CardDescription>
                  최근 10개 레코드를 표시합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  {tableData.length > 0 ? (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          {Object.keys(tableData[0]).map((key) => (
                            <th key={key} className="text-left p-2 font-medium">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((row, index) => (
                          <tr key={index} className="border-b">
                            {Object.values(row).map((value, cellIndex) => (
                              <td key={cellIndex} className="p-2 text-sm">
                                {typeof value === 'object'
                                  ? JSON.stringify(value)
                                  : String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-muted-foreground">데이터가 없습니다.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="query" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                커스텀 SQL 쿼리
              </CardTitle>
              <CardDescription>
                직접 SQL 쿼리를 실행할 수 있습니다. (보안상 제한이 있을 수
                있습니다)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="custom-query">SQL 쿼리</Label>
                <Textarea
                  id="custom-query"
                  placeholder="SELECT * FROM profiles LIMIT 5;"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              </div>
              <Button
                onClick={executeCustomQuery}
                disabled={!customQuery.trim()}
              >
                쿼리 실행
              </Button>

              {queryResult && (
                <div className="mt-4">
                  <Label>실행 결과</Label>
                  <div className="mt-2 p-4 bg-muted rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      {JSON.stringify(queryResult, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>실행 로그</CardTitle>
              <CardDescription>
                최근 실행된 작업들의 로그입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-muted-foreground">실행 로그가 없습니다.</p>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-3 rounded-lg border ${
                        log.success
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {log.success ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className="font-medium">{log.action}</span>
                          {log.duration && (
                            <Badge variant="outline">{log.duration}ms</Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {log.timestamp}
                        </span>
                      </div>
                      {log.error && (
                        <p className="mt-1 text-sm text-red-600">{log.error}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>로딩 중...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
