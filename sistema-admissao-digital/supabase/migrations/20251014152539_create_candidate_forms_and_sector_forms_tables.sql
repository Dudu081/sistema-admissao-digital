/*
  # Criação das tabelas de formulários

  1. Novas Tabelas
    - `candidate_forms` - Formulários principais de candidatos
      - `id` (uuid, chave primária)
      - `name` (text) - Nome do formulário
      - `department` (text) - Departamento
      - `description` (text, opcional) - Descrição
      - `fields` (jsonb) - Campos do formulário
      - `created_by` (text) - Usuário que criou
      - `created_at` (timestamptz) - Data de criação
    
    - `sector_forms` - Formulários setoriais vinculados aos formulários principais
      - `id` (uuid, chave primária)
      - `candidate_form_id` (uuid) - Referência ao formulário principal
      - `sector_id` (text) - ID do setor
      - `name` (text) - Nome do formulário setorial
      - `description` (text, opcional) - Descrição
      - `fields` (jsonb) - Campos do formulário
      - `created_by` (text) - Usuário que criou
      - `created_at` (timestamptz) - Data de criação

  2. Segurança
    - Habilitar RLS em ambas tabelas
    - Adicionar políticas para usuários autenticados
*/

-- Tabela de formulários principais
CREATE TABLE IF NOT EXISTS candidate_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  department text NOT NULL,
  description text DEFAULT '',
  fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE candidate_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all candidate forms"
  ON candidate_forms FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create candidate forms"
  ON candidate_forms FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update candidate forms"
  ON candidate_forms FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete candidate forms"
  ON candidate_forms FOR DELETE
  TO authenticated
  USING (true);

-- Tabela de formulários setoriais
CREATE TABLE IF NOT EXISTS sector_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_form_id uuid NOT NULL REFERENCES candidate_forms(id) ON DELETE CASCADE,
  sector_id text NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sector_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all sector forms"
  ON sector_forms FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create sector forms"
  ON sector_forms FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update sector forms"
  ON sector_forms FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete sector forms"
  ON sector_forms FOR DELETE
  TO authenticated
  USING (true);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_sector_forms_candidate_form_id ON sector_forms(candidate_form_id);
CREATE INDEX IF NOT EXISTS idx_sector_forms_sector_id ON sector_forms(sector_id);