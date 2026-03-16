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
      onBlur={(e: any) => editable && onEdit?.(field, e.currentTarget.textContent || "")}
    >
      {value || (editable ? "Click to edit" : "")}
    </Tag>
  );
}

const BG = "#1a1b26";
const NAME_COLOR = "#7aa2f7";
const HEADLINE_COLOR = "#9ece6a";
const HEADER_COLOR = "#bb9af7";
const COMMENT_COLOR = "#565f89";
const GUTTER_WIDTH = 32;

export default function DeveloperResume({ data, editable, onEdit }: ResumeProps) {
  if (!data) return null;

  return (
    <div
      className="w-[794px] min-h-[1123px] mx-auto shadow-2xl font-mono text-sm overflow-hidden flex"
      style={{ backgroundColor: BG }}
    >
      {/* Line numbers gutter */}
      <div
        className="shrink-0 py-6 pr-2 text-right select-none"
        style={{ width: GUTTER_WIDTH, color: COMMENT_COLOR, fontSize: 11 }}
      >
        {Array.from({ length: 80 }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>

      <div className="flex-1 py-6 pr-6 overflow-hidden">
        {/* Name & headline */}
        <div className="mb-4 flex items-start gap-4">
          {data.image && (
            <img src={data.image} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-green-500/50 shrink-0" />
          )}
          <div>
          <span style={{ color: COMMENT_COLOR }} className="italic">
            {"// "}resume.ts
          </span>
          <div className="mt-2">
            <span style={{ color: NAME_COLOR }}>const </span>
            <span style={{ color: "#c0caf5" }}>name</span>
            <span style={{ color: "#9ece6a" }}> = </span>
            <span style={{ color: "#e0af68" }}>{'"'}</span>
            <EditableText value={data.name} field="name" editable={editable} onEdit={onEdit} tag="span" />
            <span style={{ color: "#e0af68" }}>{'"'}</span>
            <span style={{ color: "#9ece6a" }}>;</span>
          </div>
          <div className="mt-1">
            <span style={{ color: "#c0caf5" }}>headline</span>
            <span style={{ color: "#9ece6a" }}> = </span>
            <span style={{ color: "#e0af68" }}>{'"'}</span>
            <EditableText value={data.headline} field="headline" editable={editable} onEdit={onEdit} tag="span" />
            <span style={{ color: "#e0af68" }}>{'"'}</span>
            <span style={{ color: "#9ece6a" }}>;</span>
          </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mb-4" style={{ color: COMMENT_COLOR }}>
          <span className="italic">{"// "}contact</span>
          <div className="text-gray-400 text-xs mt-1 space-y-0.5">
            {data.email && <div>email: {data.email}</div>}
            {data.phone && <div>phone: {data.phone}</div>}
            {data.location && <div>location: {data.location}</div>}
            {data.website && <div>website: {data.website}</div>}
          </div>
        </div>

        {/* Bio */}
        {(data.bio || editable) && (
          <div className="mb-4">
            <span style={{ color: HEADER_COLOR }}>{"// bio"}</span>
            <p className="text-gray-400 mt-1 leading-relaxed">
              <EditableText value={data.bio} field="bio" editable={editable} onEdit={onEdit} tag="span" />
            </p>
          </div>
        )}

        {/* Skills — import style */}
        {data.skills?.length > 0 && (
          <div className="mb-4">
            <span style={{ color: HEADER_COLOR }}>{"// skills"}</span>
            <div className="mt-2 space-y-1">
              {data.skills.map((skill: any) => (
                <div key={skill.id} className="text-gray-400">
                  <span style={{ color: "#7aa2f7" }}>import</span>
                  <span style={{ color: "#9ece6a" }}> {"{ "}</span>
                  <span style={{ color: "#c0caf5" }}>{skill.name}</span>
                  <span style={{ color: "#9ece6a" }}> {"}"}</span>
                  <span style={{ color: "#7aa2f7" }}> from </span>
                  <span style={{ color: "#e0af68" }}>{`"${skill.category || "stack"}"`}</span>
                  <span style={{ color: "#9ece6a" }}>;</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {data.experiences?.length > 0 && (
          <div className="mb-4">
            <span style={{ color: HEADER_COLOR }}>{"// experience"}</span>
            <div className="mt-2 space-y-4">
              {data.experiences.map((exp: any) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline gap-2">
                    <span style={{ color: "#c0caf5" }}>{exp.position}</span>
                    <span style={{ color: COMMENT_COLOR }} className="italic text-xs">
                      {"// "}
                      {formatDate(exp.startDate)} — {exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}
                    </span>
                  </div>
                  <div style={{ color: "#7aa2f7" }} className="text-xs">
                    @ {exp.company}
                  </div>
                  {exp.description && (
                    <p className="text-gray-400 text-xs mt-1 leading-relaxed pl-2 border-l-2 border-gray-700">
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
            <span style={{ color: HEADER_COLOR }}>{"// projects"}</span>
            <div className="mt-2 space-y-3">
              {data.projects.map((proj: any) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline gap-2">
                    <span style={{ color: "#c0caf5" }}>{proj.title}</span>
                    <div className="flex gap-2 text-xs">
                      {proj.githubUrl && <a href={proj.githubUrl} style={{ color: "#7aa2f7" }} className="hover:underline">repo</a>}
                      {proj.liveUrl && <a href={proj.liveUrl} style={{ color: "#9ece6a" }} className="hover:underline">live</a>}
                    </div>
                  </div>
                  {proj.description && (
                    <p className="text-gray-400 text-xs mt-1 leading-relaxed pl-2 border-l-2 border-gray-700">{proj.description}</p>
                  )}
                  {proj.techStack?.length > 0 && (
                    <p style={{ color: COMMENT_COLOR }} className="text-xs mt-0.5">{proj.techStack.join(" | ")}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.educations?.length > 0 && (
          <div>
            <span style={{ color: HEADER_COLOR }}>{"// education"}</span>
            <div className="mt-2 space-y-3">
              {data.educations.map((edu: any) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline gap-2">
                    <span style={{ color: "#c0caf5" }}>
                      {edu.degree}
                      {edu.field ? ` in ${edu.field}` : ""}
                    </span>
                    <span style={{ color: COMMENT_COLOR }} className="italic text-xs">
                      {"// "}
                      {formatDate(edu.startDate)} — {edu.current ? "Present" : edu.endDate ? formatDate(edu.endDate) : ""}
                    </span>
                  </div>
                  <div style={{ color: "#7aa2f7" }} className="text-xs">
                    {edu.institution}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
