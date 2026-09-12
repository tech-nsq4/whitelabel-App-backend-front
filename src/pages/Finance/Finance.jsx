import { useFinance } from '../../hooks/queries/useFinance'
import FinanceStats from './components/FinanceStats'
import FinanceTable from './components/FinanceTable'
import { SkeletonTable } from '../../components/ui'

export default function Finance() {
  const { data, isLoading, isError } = useFinance()

  return (
    <div className="page-fade">
      <div className="page-head">
        <div>
          <h1>المالية</h1>
          <div className="sub">ملخص الفواتير والإيرادات</div>
        </div>
      </div>

      {isLoading && <SkeletonTable />}
      {isError && (
        <div className="panel" style={{ padding: 32, textAlign: 'center', color: 'var(--danger)', fontSize: 13 }}>
          تعذّر تحميل البيانات المالية
        </div>
      )}

      {data && (
        <>
          <FinanceStats summary={data.summary} />
          <FinanceTable invoices={data.invoices} />
        </>
      )}
    </div>
  )
}
