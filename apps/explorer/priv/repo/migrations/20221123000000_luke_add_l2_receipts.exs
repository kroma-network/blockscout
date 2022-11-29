defmodule Explorer.Repo.Migrations.LukeAddL2Receipts do
  use Ecto.Migration

  def change do
    alter table(:transactions) do
      add(:l1_gas_used, :numeric, precision: 100, null: true)
      add(:l1_gas_price, :numeric, precision: 100, null: true)
      add(:l1_fee, :numeric, precision: 100, null: true)
      add(:l1_fee_scalar, :string, null: true)
    end
  end
end
