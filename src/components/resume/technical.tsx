"use client";

import { formatDate } from "@/lib/utils";

interface ResumeProps {
  data: any;
  editable?: boolean;
  onEdit?: (field: string, value: string) => void;
}

function EditableText({
  value,
  field,
  editable,
  onEdit,
  className,
  tag: Tag = "span",
}: {
  value: string;
  field: string;
  editable?: boolean;
  onEdit?: (field: string, value: string) => void;
  className?: string;
  tag?: any;
}) {
  if (!value && !editable) return null;
  return (
    <Tag
      className={`${className || ""} ${editable ? "outline-none ring-1 ring-transparent hover:ring-indigo-400/50 focus:ring-indigo-500 rounded px-0.5 cursor-text" : ""}`}
      contentEditable={editable}
      suppressContentEditableWarning
      onBlur={(e: any) =>
        editable && onEdit?.(field, e.currentTarget.textContent || "")
      }
    >
      {value || (editable ? "Click to edit" : "")}
    </Tag>
  );
}

export default function TechnicalResume({
  data,
  editable,
  onEdit,
}: ResumeProps) {
  if (!data) return null;

  const groupedSkills =
    data.skills?.reduce(
      (acc: any, skill: any) => {
        const cat = skill.category || "general";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill);
        return acc;
      },
      {} as Record<string, any[]>,
    ) || {};

  return (
    <div className="bg-gray-950 text-gray-200 p-4 sm:p-6 lg:p-10 space-y-4 sm:space-y-5 lg:space-y-6 font-mono w-full max-w-[794px] min-h-screen print:min-h-[1123px] mx-auto shadow-sm lg:shadow-2xl">
      {/* Header — terminal style */}
      <div className="border border-green-500/30 rounded-lg p-5 bg-black/50">
        <div className="flex items-center gap-2 mb-3 text-xs text-green-600">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2">resume.sh</span>
        </div>
        <div className="flex items-start gap-4">
          {data.image && (
            <img
              src={data.image}
              alt=""
              className="w-12 h-12 rounded-full object-cover ring-2 ring-green-500/50 shrink-0"
            />
          )}
          <div className="text-sm space-y-1 flex-1">
            <p>
              <span className="text-green-500">$</span> echo $NAME
            </p>
            <EditableText
              value={data.name}
              field="name"
              editable={editable}
              onEdit={onEdit}
              className="text-white text-xl font-bold block"
              tag="p"
            />
            {(data.headline || editable) && (
              <>
                <p>
                  <span className="text-green-500">$</span> cat role.txt
                </p>
                <EditableText
                  value={data.headline}
                  field="headline"
                  editable={editable}
                  onEdit={onEdit}
                  className="text-green-400 block"
                  tag="p"
                />
              </>
            )}
            <p>
              <span className="text-green-500">$</span> cat contact.json
            </p>
            <p className="text-cyan-400 text-xs">
              {"{ "}
              {data.email && `"email": "${data.email}"`}
              {data.phone && `, "phone": "${data.phone}"`}
              {data.location && `, "location": "${data.location}"`}
              {data.website && `, "website": "${data.website}"`}
              {" }"}
            </p>
          </div>
        </div>
      </div>

      {/* About */}
      {(data.bio || editable) && (
        <div>
          <h2 className="text-sm font-bold text-green-400 mb-2 flex items-center gap-2">
            <span className="text-green-600">#</span> README.md
          </h2>
          <EditableText
            value={data.bio}
            field="bio"
            editable={editable}
            onEdit={onEdit}
            className="text-xs text-gray-400 leading-relaxed pl-4 border-l-2 border-green-900 block"
            tag="p"
          />
        </div>
      )}

      {/* Skills — grouped by category */}
      {data.skills?.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
            <span className="text-green-600">#</span> tech_stack
          </h2>
          <div className="space-y-3">
            {Object.entries(groupedSkills).map(
              ([cat, skills]: [string, any]) => (
                <div key={cat}>
                  <p className="text-xs text-green-600 uppercase mb-1.5">{`// ${cat}`}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s: any) => (
                      <span
                        key={s.id}
                        className="px-2 py-0.5 text-[11px] rounded border border-green-500/30 text-green-300 bg-green-500/5"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experiences?.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
            <span className="text-green-600">#</span> work_history
          </h2>
          <div className="space-y-4">
            {data.experiences.map((exp: any) => (
              <div
                key={exp.id}
                className="border border-gray-800 rounded-lg p-4 bg-gray-900/50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {exp.position}
                    </h3>
                    <p className="text-xs text-cyan-400">@{exp.company}</p>
                  </div>
                  <span className="text-[10px] text-gray-600 font-mono">
                    {formatDate(exp.startDate)} →{" "}
                    {exp.current
                      ? "now"
                      : exp.endDate
                        ? formatDate(exp.endDate)
                        : ""}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
            <span className="text-green-600">#</span> projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((proj: any) => (
              <div
                key={proj.id}
                className="border border-gray-800 rounded-lg p-3 bg-gray-900/50"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-white">{proj.title}</h3>
                  <div className="flex gap-2 text-[10px]">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        className="text-cyan-400 hover:underline"
                      >
                        repo
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        className="text-green-400 hover:underline"
                      >
                        live
                      </a>
                    )}
                  </div>
                </div>
                {proj.description && (
                  <p className="text-xs text-gray-400 mt-1">
                    {proj.description}
                  </p>
                )}
                {proj.techStack?.length > 0 && (
                  <p className="text-[10px] text-gray-600 mt-1">
                    {proj.techStack.join(" | ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.educations?.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
            <span className="text-green-600">#</span> education
          </h2>
          <div className="space-y-3">
            {data.educations.map((edu: any) => (
              <div
                key={edu.id}
                className="border border-gray-800 rounded-lg p-3 bg-gray-900/50"
              >
                <h3 className="text-sm font-bold text-white">
                  {edu.degree}
                  {edu.field ? ` in ${edu.field}` : ""}
                </h3>
                <p className="text-xs text-cyan-400">{edu.institution}</p>
                <p className="text-[10px] text-gray-600 mt-1">
                  {formatDate(edu.startDate)} →{" "}
                  {edu.current
                    ? "now"
                    : edu.endDate
                      ? formatDate(edu.endDate)
                      : ""}
                  {edu.grade && ` | GPA: ${edu.grade}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Links */}
      {data.socialLinks?.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-green-400 mb-2 flex items-center gap-2">
            <span className="text-green-600">#</span> links
          </h2>
          <div className="flex flex-wrap gap-3 text-xs">
            {data.socialLinks.map((link: any) => (
              <span key={link.id} className="text-cyan-400">
                [{link.platform}](
                <span className="text-gray-500">{link.url}</span>)
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
